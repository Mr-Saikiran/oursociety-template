import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { AppShell } from '@/components/app-shell'
import { SessionProvider } from '@/components/session-provider'
import { getCurrentUser } from '@/lib/auth'
import { all } from '@/lib/repo'
import { society } from '@/society/config'
import { asset, STATIC_DEMO } from '@/lib/static'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${society.appName} — ${society.shortName}`,
    template: `%s · ${society.appName}`,
  },
  applicationName: society.appName,
  description: `${society.appName}: community app for ${society.name} (${society.acronym}), ${society.location}. Maintenance, finances, committees, meetings, amenities and resident requests.`,
  generator: 'v0.app',
  manifest: asset('/manifest.webmanifest'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: society.appName,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f4e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1c1c' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [user, notices, requests, maintenance] = await Promise.all([
    getCurrentUser(),
    all('notices'),
    all('requests'),
    all('maintenance'),
  ])
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body
        className={`${nunito.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider user={user}>
            <AppShell live={{ notices, requests, maintenance }}>{children}</AppShell>
          </SessionProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && !STATIC_DEMO && <Analytics />}
      </body>
    </html>
  )
}
