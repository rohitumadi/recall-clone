import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getItemFn } from '@/data/items'
import { handleCopyUrlFn } from '@/lib/clipboard'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Copy,
  ExternalLink,
  Globe,
  ImageIcon,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  pendingComponent: ItemDetailSkeleton,
  loader: async ({ params }) => {
    const item = await getItemFn({ data: { id: params.itemId } })
    return { item }
  },
})

// Helper functions (reused logic for consistency)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
    case 'FAILED':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20'
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return 'Unknown Date'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleCopyUrl = (url: string) => {
  handleCopyUrlFn(url)
  toast.success('URL copied to clipboard!')
}

function RouteComponent() {
  const { item } = Route.useLoaderData()

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-orange-950/20 dark:via-background dark:to-blue-950/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/items"
            className={buttonVariants({
              variant: 'ghost',
              className:
                'group hover:bg-background/80 hover:scale-105 transition-all duration-200',
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Items
          </Link>
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-0 shadow-2xl bg-background/60 backdrop-blur-md overflow-hidden ring-1 ring-border/50">
              {/* Hero Image */}
              <div className="relative w-full h-[300px] md:h-[400px] bg-muted/30 group overflow-hidden">
                {item.ogImage ? (
                  <img
                    src={item.ogImage}
                    alt={item.title || 'Item image'}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove(
                        'hidden',
                      )
                    }}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100/50 to-blue-100/50 dark:from-orange-950/50 dark:to-blue-950/50 ${item.ogImage ? 'hidden' : ''}`}
                >
                  <ImageIcon className="w-20 h-20 text-muted-foreground/20" />
                </div>
              </div>

              <CardHeader className="space-y-4 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </Badge>
                  {item.publishedAt && (
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(item.publishedAt)}
                    </div>
                  )}
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {item.title || 'Untitled Item'}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  <Globe className="w-4 h-4" />
                  <span className="truncate max-w-md">
                    {new URL(item.url).hostname}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full" />
                    Content Preview
                  </h3>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-6 bg-muted/30">
                    {item.content ? (
                      <div className="whitespace-pre-wrap text-muted-foreground font-light leading-relaxed">
                        {item.content}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
                        <p>No preview content available</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-2 ">
            <Card className="bg-background/60 backdrop-blur-md border-border/50 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex  flex-col  gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(item.url)}
                    className="bg-background/50 backdrop-blur-sm hover:bg-background transition-all"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                    className="bg-gradient-to-r from-orange-600 to-blue-600 hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Visit Original <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Author
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-200 to-blue-200 dark:from-orange-800 dark:to-blue-800 flex items-center justify-center">
                      <User className="w-5 h-5 opacity-70" />
                    </div>
                    <span className="font-medium">
                      {item.author || 'Unknown Author'}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Added Date
                  </label>
                  <div className="flex items-center gap-2 text-sm p-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {item.createdAt
                      ? formatDate(item.createdAt)
                      : 'Recently added'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Source Domain
                  </label>
                  <div className="flex items-center gap-2 text-sm p-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">
                      {new URL(item.url).hostname}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-muted/50 hover:bg-muted text-foreground"
                    variant="ghost"
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    Share Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemDetailSkeleton() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-orange-950/20 dark:via-background dark:to-blue-950/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        {/* Nav Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-xl overflow-hidden">
              <Skeleton className="w-full h-[300px] md:h-[400px]" />
              <CardHeader className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-[300px] w-full rounded-md" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-24" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
