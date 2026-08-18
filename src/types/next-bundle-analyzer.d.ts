declare module '@next/bundle-analyzer' {
  import type { NextConfig } from 'next'

  interface BundleAnalyzerOptions {
    enabled?: boolean
    openAnalyzer?: boolean
    analyzerMode?: 'json' | 'static'
    logLevel?: 'info' | 'warn' | 'error' | 'silent'
  }

  function withBundleAnalyzer(options?: BundleAnalyzerOptions): (config?: NextConfig) => NextConfig

  export = withBundleAnalyzer
}

