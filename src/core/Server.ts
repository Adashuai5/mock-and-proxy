import * as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import * as vscode from 'vscode'
import { getConfiguration } from './Configuration'
import Koa, { Context, Next } from 'koa'
import { compatibleWithPath } from '../core/Path'

const app = new Koa()

export const getPort = () => {
  const { port } = getConfiguration('mock')
  const configPath = getConfiguration('proxy.configPath')
  let _port = port

  if (fs.existsSync(configPath)) {
    const configData = require(configPath)
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

  ctx.response.status = 200

  if (isLocalExist) {
    ctx.response.body = fs.readFileSync(apiPath, 'utf8')
  } else {
    fs.writeFileSync(
      apiPath,
      JSON.stringify({ code: '000000', success: true, data: null })
    )

    ctx.response.body = fs.readFileSync(apiPath, 'utf8')
  }

  await next()
}

export const runMockServer = async () => {
  try {
    const port = getPort()

    app.use(getResponse)

    const success = app.listen(port)

    if (success.listening) {
      return Promise.resolve({ port })
    } else {
      return Promise.reject(new Error('服务启动失败'))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
