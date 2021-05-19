import * as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import { getConfiguration } from './Configuration'
import { compatibleWithPath } from '../utils/path'
import { mergeProxyConfig } from '../utils/config'
import Koa, { Context, Next } from 'koa'
import proxy, { IBaseKoaProxiesOptions } from 'koa-proxies'
import bodyparser from 'koa-bodyparser'
import { Server } from 'http'

let server: Server

export const getPort = () => {
  const { port } = getConfiguration('mock')
  const configPath = getConfiguration('proxy.configPath')
  let _port = port

  if (fs.existsSync(configPath)) {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    _port = configData.port || _port
  }

  return _port
}

export const getResponse = async (ctx: Context, next: Next) => {
  ctx.response.type = 'json'

  if (!ctx.request.url) {
    ctx.response.status = 500
    ctx.response.body = {
      code: 999999,
      success: false,
      data: null,
      msg: '等待初始化完成',
    }
  }

  const pathname = url.parse(ctx.request.url).pathname
  const startWith = getConfiguration('mock.startWith')

  if (
    pathname &&
    startWith.length &&
    !startWith.some((s: string) => pathname.startsWith(s))
  ) {
    ctx.response.status = 500
    ctx.response.body = {
      code: 999999,
      success: false,
      data: null,
      msg: '不支持该请求',
    }
  }

  const rootDir = getConfiguration('mock.rootDir')
  const apiPath = compatibleWithPath(path.join(rootDir, pathname + '.json'))
  const isLocalExist = fs.existsSync(apiPath)

  if (isLocalExist) {
    ctx.response.status = 200
    ctx.response.body = fs.readFileSync(apiPath, 'utf8')
  } else {
    const apiDir = path.dirname(apiPath)

    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true })
    }

    fs.writeFileSync(
      apiPath,
      JSON.stringify({ code: '000000', success: true, data: null })
    )

    ctx.response.status = 200
    ctx.response.body = fs.readFileSync(apiPath, 'utf8')
  }

  await next()
}

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

export const setupProxy = async (config: IBaseKoaProxiesOptions | string) => {
  server?.close()
  const app = new Koa()

  app.use(proxy('*', mergeProxyConfig(config)))

  app.use(
    bodyparser({
      enableTypes: ['json', 'form', 'text'],
    })
  )

  const port = getPort()
  server = app.listen(port)
}
