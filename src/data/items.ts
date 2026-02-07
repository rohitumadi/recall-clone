import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import { extractSchema, importBulkSchema, importSchema } from '@/schemas/import'
import { authFnMiddleware } from '@/middlewares/auth'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data, context }) => {
    const session = context.session
    const url = data.url
    const item = await prisma.savedItem.create({
      data: {
        url: url,
        userId: session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      // Convert Zod schema to JSON Schema for Zod v4 compatibility
      const jsonSchema = z.toJSONSchema(extractSchema)

      const doc = await firecrawl.scrape(url, {
        formats: [
          'markdown',
          {
            type: 'json',
            schema: jsonSchema, // Use the converted JSON Schema instead of Zod schema
          },
        ],
        location: {
          country: 'IN',
          languages: ['en'],
        },
        onlyMainContent: true,
        proxy: 'auto',
      })

      // Try to get JSON data
      const jsonData = doc.json as z.infer<typeof extractSchema> | undefined

      let publishedAt = null
      let author = null

      if (jsonData) {
        console.log('Extracted JSON data:', jsonData)
        author = jsonData.author || null

        if (jsonData.publishedAt) {
          publishedAt = new Date(jsonData.publishedAt)
          if (isNaN(publishedAt.getTime())) {
            publishedAt = null
          }
        }
      } else {
        console.warn('No JSON extraction data available')
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: doc.metadata?.title || null,
          status: 'COMPLETED',
          content: doc.markdown || null,
          author: author,
          ogImage: doc.metadata?.ogImage || null,
          publishedAt: publishedAt,
        },
      })

      return updatedItem
    } catch (error) {
      console.error('Error scraping URL:', error)
      const failedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          status: 'FAILED',
        },
      })
      return failedItem
    }
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importBulkSchema)
  .handler(async ({ data }) => {
    const { url, search } = data
    try {
      const res = await firecrawl.map(url, {
        limit: 5,
        search,
        location: {
          country: 'IN',
          languages: ['en'],
        },
      })
      return res.links
    } catch (error) {
      console.log(error)
    }
  })

export const bulkScrapeFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      urls: z.array(z.url()),
    }),
  )
  .handler(async ({ data, context }) => {
    const { urls } = data
    const session = context.session
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const item = await prisma.savedItem.create({
        data: {
          url: url,
          userId: session.user.id,
          status: 'PENDING',
        },
      })

      try {
        // Convert Zod schema to JSON Schema for Zod v4 compatibility
        const jsonSchema = z.toJSONSchema(extractSchema)

        const doc = await firecrawl.scrape(url, {
          formats: [
            'markdown',
            {
              type: 'json',
              schema: jsonSchema, // Use the converted JSON Schema instead of Zod schema
            },
          ],
          location: {
            country: 'IN',
            languages: ['en'],
          },
          onlyMainContent: true,
          proxy: 'auto',
        })

        // Try to get JSON data
        const jsonData = doc.json as z.infer<typeof extractSchema> | undefined

        let publishedAt = null
        let author = null

        if (jsonData) {
          console.log('Extracted JSON data:', jsonData)
          author = jsonData.author || null

          if (jsonData.publishedAt) {
            publishedAt = new Date(jsonData.publishedAt)
            if (isNaN(publishedAt.getTime())) {
              publishedAt = null
            }
          }
        } else {
          console.warn('No JSON extraction data available')
        }
        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            title: doc.metadata?.title || null,
            status: 'COMPLETED',
            content: doc.markdown || null,
            author: author,
            ogImage: doc.metadata?.ogImage || null,
            publishedAt: publishedAt,
          },
        })
      } catch (error) {
        console.error('Error scraping URL:', error)
        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            status: 'FAILED',
          },
        })
      }
    }
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const session = context.session
    const items = await prisma.savedItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return items
  })
