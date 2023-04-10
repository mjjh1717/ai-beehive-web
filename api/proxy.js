import { createProxyMiddleware } from 'http-proxy-middleware'

export default (req, res) => {
  let target = ''
  if (req.url.startsWith('/api'))
    target = process.env.VITE_APP_API_BASE_URL

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api', '/'),
    // 添加 proxy_buffering off 参数
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('proxy_buffering', 'off')
    },
  })

  // 设置响应头，表明响应数据的类型是流式的
  res.setHeader('Content-Type', 'application/octet-stream')

  // 覆盖 res.write() 方法，逐步将响应数据写入到客户端
  const originalWrite = res.write
  res.write = function (chunk, encoding, callback) {
    // 向客户端发送当前的数据块
    res.flushHeaders()
    originalWrite.call(res, chunk, encoding, callback)
  }

  // 调用代理中间件，并将其响应数据转换为流式输出
  proxy(req, res, (err) => {
    if (err) {
      console.error(err)
      // 发送错误信息到客户端
      res.statusCode = 500
      res.end('Internal Server Error')
    }
    // 标志着所有的响应数据已经全部发送完毕
    res.end()
  })
}
