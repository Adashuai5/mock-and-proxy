import * as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import { getConfiguration } from './Configuration'
import { compatibleWithPath } from '../utils/path'
import { Context, Next } from 'koa'
import axios, { AxiosRequestConfig } from 'axios'

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

const mockRootDir = getConfiguration('mock.rootDir')

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

  const pathname = url.parse(ctx.url).pathname
  const startWith = getConfiguration('mock.startWith')

  if (
    pathname &&
    startWith.length &&
    !startWith.some((s: string) => pathname.startsWith(s))
  ) {
    ctx.status = 500
    ctx.body = {
      code: "999999",
      success: false,
      data: null,
      desc: '不支持该请求',
    }
  }

  const apiPath = compatibleWithPath(path.join(mockRootDir, pathname + '.json'))
  const isLocalExist = fs.existsSync(apiPath)

  if (isLocalExist) {
    ctx.status = 200
    ctx.body = fs.readFileSync(apiPath, 'utf8')
  } else {
    const apiDir = path.dirname(apiPath)

    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true })
    }

    fs.writeFileSync(
      apiPath,
      JSON.stringify({ code: "000000", success: true, data: null, desc: null })
    )

    ctx.status = 200
    ctx.body = fs.readFileSync(apiPath, 'utf8')
  }

  await next()
}

export const getRealResponse = (baseURL: string) => async (ctx: Context, next: Next) => {
  const pathname = url.parse(ctx.url).pathname
  const apiPath = compatibleWithPath(path.join(mockRootDir, pathname + '.json'))
  const isLocalExist = fs.existsSync(apiPath)
  const apiDir = path.dirname(apiPath)

  if (ctx.status === 200 && (!isLocalExist || !JSON.parse(fs.readFileSync(apiPath, 'utf8')).data)) {
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true })
    }

    const { header, method, url } = ctx.request

    try {
      const instance = axios.create({
        baseURL, withCredentials: true,
      });

      const result = await instance({ url, method, headers: { cookie: header.cookie } } as AxiosRequestConfig)

      fs.writeFileSync(
        apiPath,
        JSON.stringify(result.data)
      )
    } catch (error) {
      fs.writeFileSync(
        apiPath,
        JSON.stringify({ code: "000000", success: true, data: null, desc: null })
      )
    }
  }
  await next()
}
