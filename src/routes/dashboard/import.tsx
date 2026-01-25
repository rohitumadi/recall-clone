import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-full items-center justify-center ">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Import Content</h1>
        <p className="text-sm text-muted-foreground">
          Save Webpages to your library for later reading
        </p>
      </div>
    </div>
  )
}
