import { createClientOnlyFn } from '@tanstack/react-start'

export const handleCopyUrlFn = createClientOnlyFn(async (url: string) => {
  await navigator.clipboard.writeText(url)
})
