import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'

export const config: GatsbyFunctionConfig = {
  bodyParser: {
    json: {
      type: 'application/json'
    }
  }
}

type TelegramCommand = {
  command: string
  description: string
}

const DEFAULT_COMMANDS: TelegramCommand[] = [
  { command: 'start', description: 'Welcome and quick guide' },
  { command: 'help', description: 'Show available commands' },
  {
    command: 'order',
    description: 'Get order updates: /order <orderId>'
  },
  { command: 'status', description: 'Bot health status' },
  { command: 'ping', description: 'Ping test' }
]

const ADMIN_CHAT_COMMANDS: TelegramCommand[] = [
  ...DEFAULT_COMMANDS,
  {
    command: 'orders',
    description: 'Recent orders summary: /orders [n]'
  },
  {
    command: 'recent',
    description: 'Alias for /orders [n]'
  }
]

const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (!value) return ''
  return Array.isArray(value) ? value[0] || '' : value
}

const callTelegram = async (
  botToken: string,
  method: string,
  payload: Record<string, unknown>
): Promise<void> => {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram API error: ${errorText}`)
  }

  const data = (await response.json()) as { ok?: boolean; description?: string }
  if (!data.ok) {
    throw new Error(data.description || 'Telegram API returned ok=false')
  }
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const setupSecret = process.env.TELEGRAM_SETUP_SECRET
  if (setupSecret) {
    const providedSecret = normalizeHeaderValue(
      req.headers['x-telegram-setup-secret'] as string | string[] | undefined
    )

    if (!providedSecret || providedSecret !== setupSecret) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return res.status(500).json({ error: 'Missing TELEGRAM_BOT_TOKEN' })
  }

  const languageCode =
    typeof req.body?.languageCode === 'string'
      ? req.body.languageCode
      : undefined

  try {
    // Public/default commands for all chats.
    await callTelegram(botToken, 'setMyCommands', {
      commands: DEFAULT_COMMANDS,
      ...(languageCode ? { language_code: languageCode } : {})
    })

    // Admin-only commands include /orders and /recent in TELEGRAM_CHAT_ID scope.
    const adminChatId = process.env.TELEGRAM_CHAT_ID
    if (adminChatId) {
      await callTelegram(botToken, 'setMyCommands', {
        commands: ADMIN_CHAT_COMMANDS,
        scope: {
          type: 'chat',
          chat_id: Number(adminChatId)
        },
        ...(languageCode ? { language_code: languageCode } : {})
      })
    }

    return res.status(200).json({
      ok: true,
      defaultCommandsCount: DEFAULT_COMMANDS.length,
      adminCommandsCount: adminChatId ? ADMIN_CHAT_COMMANDS.length : 0,
      adminCommandsEnabled: Boolean(adminChatId)
    })
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error'
    console.error('telegram-set-commands error:', reason)
    return res.status(500).json({ error: reason })
  }
}
