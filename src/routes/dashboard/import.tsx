import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { importBulkSchema, importSchema } from '@/schemas/import'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, Link, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {})
    },
  })
  const bulkForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: importBulkSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {})
    },
  })
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-blue-50 dark:from-orange-950/20 dark:via-background dark:to-blue-950/20" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Floating Decorative Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full gap-8 flex flex-col lg:flex-row items-start justify-center p-8 max-w-7xl mx-auto">
        {/* Left Section - Main Form */}
        <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800">
              <Globe className="size-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Web Content Importer
              </span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Import Content
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Save webpages to your library for later reading and never lose
              track of important content
            </p>
          </div>

          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/60 backdrop-blur-sm">
              <TabsTrigger value="single" className="gap-2">
                <Link className="size-4" />
                Single URL
              </TabsTrigger>
              <TabsTrigger value="bulk" className="gap-2">
                <Globe className="size-4" />
                Bulk Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <Card className="border-2 bg-background/60 backdrop-blur-sm shadow-2xl">
                <CardHeader className="border-b border-orange-100 dark:border-orange-900/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                      <Link className="size-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>Single URL</CardTitle>
                      <CardDescription>
                        Scrape and save content from any webpage 👀
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      form.handleSubmit()
                    }}
                  >
                    <FieldGroup>
                      <form.Field
                        name="url"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="https://tanstack.com/start/latest"
                                autoComplete="off"
                                className="h-12 text-base"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      {isPending ? (
                        <Button disabled className="h-12 text-base">
                          <Loader2 className="size-4 animate-spin" />
                          Importing...
                        </Button>
                      ) : (
                        <Button type="submit" className="h-12 text-base">
                          Import
                        </Button>
                      )}
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulk">
              <Card className="border-2 bg-background/60 backdrop-blur-sm shadow-2xl">
                <CardHeader className="border-b border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                      <Globe className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Bulk Import</CardTitle>
                      <CardDescription>
                        Discover and import URLs from multiple webpages 🚀
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      bulkForm.handleSubmit()
                    }}
                  >
                    <FieldGroup>
                      <bulkForm.Field
                        name="url"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="https://tanstack.com/start/latest"
                                autoComplete="off"
                                className="h-12 text-base"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      <bulkForm.Field
                        name="search"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Filter (Optional)
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Blogs,docs,News, etc."
                                autoComplete="off"
                                className="h-12 text-base"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      {isPending ? (
                        <Button disabled className="h-12 text-base">
                          <Loader2 className="size-4 animate-spin" />
                          Importing...
                        </Button>
                      ) : (
                        <Button type="submit" className="h-12 text-base">
                          Import URLs
                        </Button>
                      )}
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section - Info Cards */}
        <div className="flex-shrink-0 w-full lg:w-80 flex flex-col gap-4">
          <Card className="bg-background/60 backdrop-blur-sm border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">💡</span>
                How it Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Paste URL</p>
                  <p className="text-xs text-muted-foreground">
                    Enter the webpage URL you want to save
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Auto Extract</p>
                  <p className="text-xs text-muted-foreground">
                    We scrape and extract the content automatically
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Save & Read</p>
                  <p className="text-xs text-muted-foreground">
                    Access your saved content anytime, anywhere
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span>Use bulk import to save multiple pages at once</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span>Filter by keywords to find specific content</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span>All content is saved offline for easy access</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
