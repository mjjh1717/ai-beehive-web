interface ViteEnv {
  VITE_PORT: number
  VITE_BASE_URL: string
  VITE_USE_MOCK?: boolean
  VITE_USE_PROXY?: boolean
  VITE_USE_HASH?: boolean
  VITE_APP_TITLE: string
  VITE_PUBLIC_PATH: string
  VITE_BASE_API: string
  VITE_USE_COMPRESS?: boolean
  VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
}

