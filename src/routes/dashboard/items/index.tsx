import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getItemsFn } from '@/data/items'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, Copy, ExternalLink, User } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  //loader is isomorphic that is on hard reload it will run on server and on client navigation it will run on client
  loader: async () => {
    const items = await getItemsFn()
    return { items }
  },
})

function RouteComponent() {
  const { items } = Route.useLoaderData()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'FAILED':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
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
    navigator.clipboard.writeText(url)
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
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Saved Items
          </h1>
          <p className="text-muted-foreground text-lg">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your
            collection
          </p>
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
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
