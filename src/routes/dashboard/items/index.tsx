import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getItemsFn } from '@/data/items'
import { ItemStatus } from '@/generated/prisma/enums'
import { handleCopyUrlFn } from '@/lib/clipboard'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Calendar, Copy, ExternalLink, User } from 'lucide-react'
import { toast } from 'sonner'
import { zodValidator } from '@tanstack/zod-adapter'
import z from 'zod'
import { useEffect, useState } from 'react'

const itemsSearchParams = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.enum(ItemStatus)]).default('all'),
})

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  //loader is isomorphic that is on hard reload it will run on server and on client navigation it will run on client
  loader: async () => {
    const items = await getItemsFn()
    return { items }
  },
  validateSearch: zodValidator(itemsSearchParams),
})

function RouteComponent() {
  const { items } = Route.useLoaderData()

  const { q, status } = Route.useSearch()
  const [searchInput, setSearchInput] = useState(q)
  const navigate = useNavigate({ from: Route.fullPath })
  useEffect(() => {
    if (searchInput === q) return
    const timeout = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchInput, q, status])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
    const matchesStatus = status === 'all' || item.status === status
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-black text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'PROCESSING':
        return 'bg-black text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'PENDING':
        return 'bg-black text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'FAILED':
        return 'bg-black text-red-600 dark:text-red-400 border-red-500/20'
      default:
        return 'bg-black text-gray-600 dark:text-gray-400 border-gray-500/20'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    handleCopyUrlFn(url)
    toast.success('URL copied to clipboard!')
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-orange-950/20 dark:via-background dark:to-blue-950/20" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Floating Decorative Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Content */}
      <div className="relative z-10 w-full p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="mb-8 grow-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Saved Items
            </h1>
            <p className="text-muted-foreground text-lg">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your
              collection
            </p>
          </div>
          {/* Search filter */}
          <div className="flex gap-4 grow-8">
            <Input
              value={searchInput}
              className="w-full"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search items..."
            />
            <Select
              value={status}
              defaultValue={status}
              onValueChange={(value) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    status: value as typeof status,
                  }),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL</SelectItem>
                {Object.values(ItemStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="bg-background/60 backdrop-blur-sm border-2">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-blue-100 dark:from-orange-950 dark:to-blue-950 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground">
                Start saving items to see them here
              </p>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-background/60 backdrop-blur-sm border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-blue-100 dark:from-orange-950 dark:to-blue-950 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <svg
                  className="w-12 h-12 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-3">
                No Results Found
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {q && status !== 'all'
                  ? `No items match "${q}" with status "${status}"`
                  : q
                    ? `No items match "${q}"`
                    : `No items with status "${status}"`}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setSearchInput('')
                    navigate({ search: { q: '', status: 'all' } })
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group relative bg-background/60 backdrop-blur-sm border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 via-background to-blue-100 dark:from-orange-950/50 dark:via-background dark:to-blue-950/50 overflow-hidden">
                  {item.ogImage ? (
                    <img
                      src={item.ogImage}
                      alt={item.title || 'Article image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-muted-foreground/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title || 'Untitled'}
                  </CardTitle>
                  <CardDescription className="flex justify-between items-center gap-1.5">
                    <Link
                      to={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {new URL(item.url).hostname}
                    </Link>
                    {/* Copy URL Button */}
                    <button
                      onClick={(e) => handleCopyUrl(item.url, e)}
                      className="rounded-lg cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 bg-background/80 backdrop-blur-md border border-border hover:bg-background transition-colors shadow-sm"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.author && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span className="truncate max-w-[120px]">
                          {item.author}
                        </span>
                      </div>
                    )}
                    {item.publishedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Preview */}
                  {item.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.content.substring(0, 150)}...
                    </p>
                  )}
                </CardContent>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
