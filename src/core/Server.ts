import { getPort, getResponse, getRealResponse } from './ServerHandle'
import Koa from 'koa'
import proxy from 'koa-better-http-proxy'
import { Server } from 'http'

let server: Server

export const runMockServer = async () => {
  try {
    server?.close()
    const app = new Koa()
    const port = getPort()

    app.use(getResponse)

    server = app.listen(port)

    if (server.listening) {
      return Promise.resolve({ port })
    } else {
      return Promise.reject(new Error('服务启动失败'))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export const setupProxy = async (url: string) => {
  server?.close()
  const app = new Koa()
  const port = getPort()

  app.use(proxy(url, {
    port: 443,
  }))

  app.use(getRealResponse(url))

  server = app.listen(port)
}
