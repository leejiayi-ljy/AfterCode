import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Single source of truth — read from wiki at startup
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, '../leetcode-analysis-system-prompt.md'),
  'utf-8',
)
const ANALYSIS_SCHEMA = JSON.parse(
  readFileSync(join(__dirname, '../leetcode-analysis-schema.json'), 'utf-8'),
)

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-app-secret']
  if (!secret || secret !== process.env.APP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { problem, code, language } = req.body ?? {}
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing required field: code' })
  }

  const userMessage = [
    problem?.trim()
      ? `Problem statement:\n${problem.trim()}`
      : 'No problem statement provided — analyze the code as-is.',
    `Language: ${language ?? 'unknown'}`,
    `Solution:\n\`\`\`${language ?? ''}\n${code}\n\`\`\``,
  ].join('\n\n')

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: ANALYSIS_SCHEMA,
        },
      },
    })

    return res.json(message.parsed_output)
  } catch (err) {
    console.error('Claude API error:', err)
    return res.status(502).json({ error: 'Upstream API error' })
  }
}
