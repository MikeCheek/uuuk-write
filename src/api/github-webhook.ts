import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { createHmac, timingSafeEqual } from 'crypto'

export const config: GatsbyFunctionConfig = {
  bodyParser: {
    raw: {}
  }
}

const TELEGRAM_TOPIC_ID = 41

const CATANIA_GREETINGS = [
  'Ciao carusi!',
  'Bongionno, carusi!',
  'Oh mbare, tuttu a postu?',
  'Salutamu da Catania!',
  'Ehi carusi, vento in poppa!'
]

type GitHubUser = {
  login?: string
  name?: string
}

type GitHubRepository = {
  full_name?: string
}

type GitHubCommit = {
  id?: string
  message?: string
}

type PushEventPayload = {
  ref?: string
  repository?: GitHubRepository
  pusher?: GitHubUser
  compare?: string
  commits?: GitHubCommit[]
  head_commit?: GitHubCommit
}

type PullRequestInfo = {
  number?: number
  title?: string
  html_url?: string
  merged?: boolean
  merged_by?: GitHubUser | null
  user?: GitHubUser
  base?: {
    ref?: string
  }
}

type PullRequestEventPayload = {
  action?: string
  repository?: GitHubRepository
  pull_request?: PullRequestInfo
}

const pickRandomGreeting = (): string => {
  const randomIndex = Math.floor(Math.random() * CATANIA_GREETINGS.length)
  return CATANIA_GREETINGS[randomIndex]
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const shortSha = (sha: string | undefined): string => {
  if (!sha) return 'N/A'
  return sha.slice(0, 7)
}

const formatDate = (): string => new Date().toLocaleString('it-IT')

const getHeaderValue = (value: string | string[] | undefined): string => {
  if (!value) return ''
  return Array.isArray(value) ? value[0] || '' : value
}

const normalizeSecret = (secret: string | undefined): string => {
  if (!secret) return ''
  return secret.trim().replace(/^['"]|['"]$/g, '')
}

const getRawBody = async (req: any): Promise<Buffer> => {
  if (Buffer.isBuffer(req.body)) {
    return req.body
  }

  if (typeof req.body === 'string') {
    return Buffer.from(req.body)
  }

  if (Buffer.isBuffer(req.rawBody)) {
    return req.rawBody
  }

  if (typeof req.rawBody === 'string') {
    return Buffer.from(req.rawBody)
  }

  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

const isValidGithubSignature = (
  rawBody: Buffer,
  signatureHeader: string,
  webhookSecret: string
): boolean => {
  if (!signatureHeader.startsWith('sha256=')) {
    return false
  }

  const expectedSignature = `sha256=${createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')}`

  const expectedBuffer = Buffer.from(expectedSignature)
  const actualBuffer = Buffer.from(signatureHeader)

  if (expectedBuffer.length !== actualBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, actualBuffer)
}

const sendTelegramMessage = async (
  message: string
): Promise<{ sent: boolean; reason: string | null }> => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return {
      sent: false,
      reason: 'Telegram configuration is missing'
    }
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_thread_id: TELEGRAM_TOPIC_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Telegram API error: ${errorText}`)
    }

    return { sent: true, reason: null }
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error'
    console.error('Telegram send error:', reason)
    return { sent: false, reason }
  }
}

const buildPushMessage = (payload: PushEventPayload): string => {
  const repo = escapeHtml(payload.repository?.full_name || 'Unknown repository')
  const pusher = escapeHtml(payload.pusher?.name || 'Unknown user')
  const commitCount = payload.commits?.length || 0
  const headCommit = payload.head_commit || payload.commits?.at(-1)
  const headCommitMessage = escapeHtml(headCommit?.message || 'N/A')
  const compareUrl = payload.compare
    ? `<a href="${escapeHtml(payload.compare)}">View compare</a>`
    : 'N/A'

  return `
${pickRandomGreeting()}

🚀 <b>New push on main</b>

📦 <b>Repository:</b> ${repo}
👤 <b>Pusher:</b> ${pusher}
🧾 <b>Commits:</b> ${commitCount}
🔖 <b>Head SHA:</b> ${escapeHtml(shortSha(headCommit?.id))}
💬 <b>Latest commit:</b> ${headCommitMessage}
🔗 <b>Compare:</b> ${compareUrl}

🕒 ${formatDate()}
  `.trim()
}

const buildMergedPrMessage = (payload: PullRequestEventPayload): string => {
  const pr = payload.pull_request
  const repo = escapeHtml(payload.repository?.full_name || 'Unknown repository')
  const prNumber = pr?.number ?? 'N/A'
  const prTitle = escapeHtml(pr?.title || 'Untitled PR')
  const author = escapeHtml(pr?.user?.login || 'Unknown user')
  const mergedBy = escapeHtml(pr?.merged_by?.login || 'Unknown user')
  const prLink = pr?.html_url
    ? `<a href="${escapeHtml(pr.html_url)}">Open PR #${prNumber}</a>`
    : `PR #${prNumber}`

  return `
${pickRandomGreeting()}

✅ <b>PR merged into main</b>

📦 <b>Repository:</b> ${repo}
🔢 <b>PR:</b> #${prNumber}
📝 <b>Title:</b> ${prTitle}
👤 <b>Author:</b> ${author}
🤝 <b>Merged by:</b> ${mergedBy}
🔗 <b>Link:</b> ${prLink}

🕒 ${formatDate()}
  `.trim()
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const webhookSecret = normalizeSecret(process.env.GITHUB_WEBHOOK_SECRET)
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Missing GITHUB_WEBHOOK_SECRET' })
  }

  const eventType = getHeaderValue(
    req.headers['x-github-event'] as string | string[] | undefined
  )
  const signature = getHeaderValue(
    req.headers['x-hub-signature-256'] as string | string[] | undefined
  )

  if (!eventType) {
    return res.status(400).json({ error: 'Missing x-github-event header' })
  }

  if (!signature) {
    return res.status(401).json({ error: 'Missing x-hub-signature-256 header' })
  }

  const rawBody = await getRawBody(req)
  if (!rawBody.length) {
    return res.status(400).json({ error: 'Empty request body' })
  }

  if (!isValidGithubSignature(rawBody, signature, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid GitHub signature' })
  }

  if (eventType === 'ping') {
    return res.status(200).json({ ok: true, message: 'pong' })
  }

  try {
    if (eventType === 'push') {
      const payload = JSON.parse(rawBody.toString('utf8')) as PushEventPayload

      if (payload.ref !== 'refs/heads/main') {
        return res.status(200).json({ ok: true, ignored: 'Push outside main' })
      }

      const telegramResult = await sendTelegramMessage(
        buildPushMessage(payload)
      )
      return res.status(200).json({ ok: true, telegram: telegramResult })
    }

    if (eventType === 'pull_request') {
      const payload = JSON.parse(
        rawBody.toString('utf8')
      ) as PullRequestEventPayload

      const pr = payload.pull_request

      if (
        payload.action !== 'closed' ||
        !pr?.merged ||
        pr.base?.ref !== 'main'
      ) {
        return res
          .status(200)
          .json({ ok: true, ignored: 'PR not merged into main' })
      }

      const telegramResult = await sendTelegramMessage(
        buildMergedPrMessage(payload)
      )

      return res.status(200).json({ ok: true, telegram: telegramResult })
    }

    return res
      .status(200)
      .json({ ok: true, ignored: `Unhandled event: ${eventType}` })
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error'
    console.error('GitHub webhook error:', reason)
    return res.status(500).json({ error: reason })
  }
}
