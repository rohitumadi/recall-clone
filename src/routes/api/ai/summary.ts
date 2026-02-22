import { prisma } from '@/db'
import { openrouter } from '@/lib/openRouter'
import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'
export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const { itemId, prompt } = await request.json()
        console.log('Summarize Request:', { itemId, prompt })

        if (!context?.session) {
          console.error('Unauthorized: No session in context')
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (!itemId || !prompt) {
          return new Response(
            JSON.stringify({ error: 'Missing itemId or prompt' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userId: context.session.user.id,
          },
        })

        if (!item) {
          console.error('Item not found for user:', {
            itemId,
            userId: context.session.user.id,
          })
          return new Response(JSON.stringify({ error: 'Item not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        console.log('Generating summary for item:', item.title)

        //stream summary
        const result = streamText({
          model: openrouter('arcee-ai/trinity-large-preview:free'),
          system:
            'You are a helpful assistant that summarizes web pages. You will be given the content of a web page and a prompt from the user. Your task is to summarize the web page according to the user`s prompt.Be 2 3 paragraphs long.Do not include any additional information and markdown.',
          prompt: `Please summarize the following web page content according to the user's prompt:
          
          Web page content:
          ${item.content}
          
          User prompt:
          ${prompt}
          `,
        })
        return result.toTextStreamResponse()
      },
    },
  },
})
