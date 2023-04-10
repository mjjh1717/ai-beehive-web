const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = (req, res) => {
  let apiTarget = ''
  if (req.url.startsWith('/api'))
    apiTarget = process.env.VITE_APP_API_BASE_URL

  const myProxy = createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: path => path.replace('/api', '/'),
    onProxyRes(proxyRes, req, res) {
      proxyRes.pipe(res)
    },
  })

  // 添加 Nginx 配置项
  const nginxConfig = {
    '/api': {
      ...myProxy,
      headers: {
        proxy_buffering: 'off',
      },
    },
  }

  // 根据请求路径获取对应的代理函数和 Nginx 配置项
  const { target, ...nginxOpts } = nginxConfig[req.url]

  // 如果没有找到，则返回 404 错误
  if (!target) {
    res.status(404).send('Not Found')
    return
  }

  // 设置透明代理模式
  myProxy(req, res, () => {
    res.writeHead(404)
    res.end()
  })
}
