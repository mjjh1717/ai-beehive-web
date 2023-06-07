const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/api'))
    target = process.env.VITE_BASE_URL

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api', '/'),
  })(req, res)
}

