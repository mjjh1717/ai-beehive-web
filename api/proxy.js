/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-10 22:13:36
 * @FilePath: \chagpt-shuowen\api\proxy.js
 * @Description: vercel 重写函数配置
 */
import http from 'http'

export default (req, res) => {
  if (req.url.startsWith('/api')) {
    const target = process.env.VITE_APP_API_BASE_URL
    const options = {
      target,
      changeOrigin: true,
      pathRewrite: path => path.replace('/api', ''),
    }

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    })

    req.pipe(proxyReq, { end: true })
  }
  else {
    res.status(404).send('Not Found')
  }
}
