import { AuthPage } from '@/components/auth-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <AuthPage />
    </div>
  )
}
