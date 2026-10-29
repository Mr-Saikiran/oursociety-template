// `npm run build:static` sets NEXT_PUBLIC_STATIC_DEMO=1 (and optionally NEXT_PUBLIC_BASE_PATH)
// to export a read-only demo to out/ for any static host.
const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === '1'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(staticDemo && {
    output: 'export',
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
