import { createProxyMiddleware } from 'http-proxy-middleware'

export default (req, res) => {
  let target = ''
  if (req.url.startsWith('/api'))
    target = process.env.VITE_APP_API_BASE_URL

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api', '/'),
  })(req, res)
}
