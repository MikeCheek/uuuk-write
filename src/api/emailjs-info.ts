import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const config: GatsbyFunctionConfig = {
  // Explicitly use Gatsby's expected bodyParser object shape
  bodyParser: {
    text: { limit: '100kb' },
    raw: { limit: '100kb' },
    json: { limit: '100kb' },
    urlencoded: { limit: '100kb', extended: true }
  }
}

const DEFAULT_API_BASE = 'https://api.emailjs.com/api/v1.0'

const tryFetch = async (url: string, token: string) => {
  try {
    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const text = await resp.text()

    // try parse JSON, fallback to raw text
    try {
      return {
        ok: resp.ok,
        status: resp.status,
        data: text ? JSON.parse(text) : null
      }
    } catch {
      return {
        ok: resp.ok,
        status: resp.status,
        data: text
      }
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const privateKey = process.env.EMAILJS_PRIVATE_KEY
  if (!privateKey) {
    return res
      .status(403)
      .json({ error: 'EmailJS private key is not configured' })
  }

  const apiBase = process.env.EMAILJS_API_BASE || DEFAULT_API_BASE

  // Candidate endpoints to probe for account information. Some may 404
  // depending on EmailJS account/API version — we aggregate whichever succeed.
  const endpoints = [
    '/admin/account',
    '/admin/account/usage',
    '/admin/account/limits',
    '/account',
    '/accounts/me'
  ]

  const results: Record<string, any> = {}

  await Promise.all(
    endpoints.map(async ep => {
      const url = `${apiBase}${ep}`
      results[ep] = await tryFetch(url, privateKey)
    })
  )

  // Try the official /history endpoint (v1.1) which returns message rows
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const HISTORY_BASE =
    process.env.EMAILJS_API_HISTORY_BASE || 'https://api.emailjs.com/api/v1.1'
  if (publicKey) {
    try {
      const historyUrl = `${HISTORY_BASE}/history?user_id=${encodeURIComponent(
        publicKey
      )}&accessToken=${encodeURIComponent(privateKey)}&page=1&count=100`
      const hResp = await fetch(historyUrl, {
        headers: { Accept: 'application/json' }
      })
      const hText = await hResp.text()
      try {
        results['/history'] = {
          ok: hResp.ok,
          status: hResp.status,
          data: hText ? JSON.parse(hText) : null
        }
      } catch {
        results['/history'] = {
          ok: hResp.ok,
          status: hResp.status,
          data: hText
        }
      }
    } catch (err: any) {
      results['/history'] = { ok: false, error: err?.message || String(err) }
    }
  } else {
    results['/history'] = { ok: false, error: 'Missing EMAILJS_PUBLIC_KEY' }
  }
  // Normalization heuristics: scan returned JSONs for common keys
  const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v)

  const findFirstMatching = (obj: any, re: RegExp): any | undefined => {
    if (obj === null || obj === undefined) return undefined
    if (typeof obj !== 'object') return undefined

    const stack = [obj]
    while (stack.length) {
      const cur = stack.shift()
      if (!cur || typeof cur !== 'object') continue
      for (const k of Object.keys(cur)) {
        try {
          if (re.test(k)) return cur[k]
        } catch {}
        const val = cur[k]
        if (isObject(val)) stack.push(val)
        if (Array.isArray(val))
          val.forEach((x: any) => isObject(x) && stack.push(x))
      }
    }
    return undefined
  }

  const parseNumber = (v: any): number | null => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const n = parseFloat(v.replace(/[^0-9.-]+/g, ''))
      return Number.isFinite(n) ? n : null
    }
    return null
  }

  const canonical: Record<string, any> = {
    emailsSent: null,
    quotaLimit: null,
    quotaRemaining: null,
    resetsOn: null,
    planName: null,
    usedPercent: null,
    internalSent: null,
    internalSince: null,
    internalResetOn: null
  }

  // aggregate only from successful JSON responses
  const jsonResults = Object.values(results)
    .filter((r: any) => r && r.ok && isObject(r.data))
    .map((r: any) => r.data)

  for (const jr of jsonResults) {
    if (canonical.emailsSent === null) {
      const v = findFirstMatching(
        jr,
        /(^|_)emails?_?sent$|messages?_?sent|\bsent\b/i
      )
      const n = parseNumber(v)
      if (n !== null) canonical.emailsSent = n
    }

    if (canonical.quotaLimit === null) {
      const v =
        findFirstMatching(
          jr,
          /quota|limit|monthly_limit|daily_limit|messages?_?per?_?month|monthly_quota/i
        ) || findFirstMatching(jr, /plan_limit|plan_quota/i)
      const n = parseNumber(v)
      if (n !== null) canonical.quotaLimit = n
      else canonical.quotaLimit = 200
    }

    if (canonical.quotaRemaining === null) {
      const v = findFirstMatching(
        jr,
        /remaining|left|available|available_messages/i
      )
      const n = parseNumber(v)
      if (n !== null) canonical.quotaRemaining = n
    }

    if (canonical.resetsOn === null) {
      const v = findFirstMatching(
        jr,
        /reset|resets|period_end|next_reset|reset_at|reset_date/i
      )
      if (typeof v === 'string' || typeof v === 'number') {
        const d = new Date(v)
        if (!isNaN(d.getTime())) canonical.resetsOn = d.toISOString()
      }
    }

    if (canonical.planName === null) {
      const v = findFirstMatching(jr, /plan|subscription|tier|package/i)
      if (typeof v === 'string') canonical.planName = v
    }
  }

  // If /history is available, compute precise counts from its rows
  const historyEntry = results['/history']
  if (historyEntry && historyEntry.ok && isObject(historyEntry.data)) {
    const rows = Array.isArray(historyEntry.data.rows)
      ? historyEntry.data.rows
      : []
    const total = rows.length
    const successCount = rows.filter((r: any) => Number(r.result) === 1).length
    const failedCount = total - successCount

    // Prefer history-derived values if available
    if (successCount > 0) canonical.emailsSent = successCount

    const quotaFromEnv = parseNumber(process.env.EMAILJS_QUOTA_LIMIT)
    if (quotaFromEnv !== null) canonical.quotaLimit = quotaFromEnv

    if (canonical.quotaLimit !== null && canonical.emailsSent !== null) {
      canonical.quotaRemaining = Math.max(
        0,
        canonical.quotaLimit - canonical.emailsSent
      )
    } else if (process.env.EMAILJS_QUOTA_ESTIMATE) {
      const est = parseNumber(process.env.EMAILJS_QUOTA_ESTIMATE)
      if (est !== null) canonical.quotaLimit = est
    }

    // derive period info
    const dates = rows
      .map((r: any) => (r && r.created_at ? new Date(r.created_at) : null))
      .filter((d: any) => d instanceof Date && !isNaN(d.getTime()))

    if (dates.length) {
      const min = new Date(Math.min(...dates.map((d: Date) => d.getTime())))
      const max = new Date(Math.max(...dates.map((d: Date) => d.getTime())))
      canonical.resetsOn = canonical.resetsOn || max.toISOString()
      // attach a small summary in canonical for the inspected page
      canonical._history = {
        pageCount: total,
        periodStart: min.toISOString(),
        periodEnd: max.toISOString(),
        failedCount
      }
    }
  }

    // Internal Firestore-based count since last monthly reset
    try {
      if (!getApps().length) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
          })
        }
      }
      const db = getFirestore()
      const now = new Date()

      // Determine the reset window. Prefer provider-provided reset date if available
      let resetEnd: Date | null = null
      if (canonical.resetsOn) {
        const d = new Date(canonical.resetsOn)
        if (!isNaN(d.getTime())) resetEnd = d
      }

      // Fallback to start of next month if no provider reset date
      if (!resetEnd) {
        resetEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      }

      // Assume monthly cycle: last reset is one month before resetEnd
      const resetStart = new Date(resetEnd.getFullYear(), resetEnd.getMonth() - 1, resetEnd.getDate())

      const resetStartIso = resetStart.toISOString()
      const resetEndIso = resetEnd.toISOString()

      const snapshot = await db
        .collection('emailjs_events')
        .where('createdAt', '>=', resetStartIso)
        .where('createdAt', '<', resetEndIso)
        .get()

      const internalCount = snapshot.size || 0
      canonical.internalSent = internalCount
      canonical.internalSince = resetStartIso
      canonical.internalResetOn = resetEndIso
    } catch (err: any) {
      // if Firestore not configured or query fails, leave internal fields null
      console.error('Failed to read internal emailjs_events:', err?.message || err)
    }

  if (canonical.emailsSent !== null && canonical.quotaLimit !== null) {
    try {
      canonical.usedPercent =
        Math.round((canonical.emailsSent / canonical.quotaLimit) * 10000) / 100
    } catch {
      canonical.usedPercent = null
    }
  }

  // Return only the canonical information to callers.
  return res.status(200).json(canonical)
}
