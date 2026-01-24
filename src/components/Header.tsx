'use client'
import { useScroll } from '@/hooks/use-scroll'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MobileNav } from '@/components/mobile-nav'
import { ModeToggle } from './ui/mode-toggle'
import { Link } from '@tanstack/react-router'
import { useTheme } from '../lib/theme-provider'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export const navLinks = [
  {
    label: 'Features',
    href: '#',
  },
  {
    label: 'Pricing',
    href: '#',
  },
  {
    label: 'About',
    href: '#',
  },
]

export function Header() {
  const scrolled = useScroll(10)
  const { theme } = useTheme()
  const { data: session, isPending } = authClient.useSession()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out',
        {
          'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow':
            scrolled,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          },
        )}
      >
        <Link to="/" href="#">
          {/* <h1 className="text-4xl font-bold">Brain Box</h1> */}
          {theme === 'dark' ? (
            <img src="/logo-dark.png" alt="Logo" width={100} height={100} />
          ) : (
            <img src="/logo.png" alt="Logo" width={100} height={100} />
          )}
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => (
            <Link
              className={buttonVariants({ variant: 'ghost' })}
              to={link.href}
              key={i}
            >
              {link.label}
            </Link>
          ))}
          <ModeToggle />
          {session ? (
            <>
              <Button
                variant="ghost"
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        toast.success('Logged out successfully')
                      },
                      onError: ({ error }) => {
                        toast.error(error.message)
                      },
                    },
                  })
                }
                className={buttonVariants({ variant: 'ghost' })}
              >
                Logout
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={buttonVariants({ variant: 'default' })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
        <MobileNav />
      </nav>
    </header>
  )
}
