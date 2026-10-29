import type { MetadataRoute } from 'next'
import { society } from '@/society/config'
import { asset } from '@/lib/static'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${society.appName} — ${society.shortName}`,
    short_name: society.appName,
    description: `${society.appName}: community app for ${society.name} (${society.acronym}), ${society.location}.`,
    start_url: asset('/'),
    display: 'standalone',
    background_color: '#f7f6f0',
    theme_color: '#1f5c4d',
    orientation: 'portrait',
    icons: [
      {
        src: asset('/icon.svg'),
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      { src: asset('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
