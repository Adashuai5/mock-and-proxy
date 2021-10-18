import * as url from 'url'
import { ConfigOptions } from './types'

// 代理的默认配置项
const DEFAULT_PROXY_OPTIONS = {
  changeOrigin: true,
}

/**
 * 统一转换格式
 * 可能存在以下几种格式
 * 1. 纯字符串： http://www.baidu.com
 * 2. target 已经是可用的对象
 */
export const mergeProxyConfig = (
  config: string | ConfigOptions
): ConfigOptions => {
  let conf: ConfigOptions
  if (typeof config === 'string') {
    conf = {
      ...DEFAULT_PROXY_OPTIONS,
      target: config,
    }
  } else {
    conf = {
      ...DEFAULT_PROXY_OPTIONS,
      ...config,
    }
  }

  return conf
}

/**
 * 解析配置文件中的目标地址
 * 存在以下几种格式
 * 1. {
 *      target: 'https://domain'
 *    }
 * 2. {
 *      target:  {
 *        name: 'xxx',
 *        target: 'https://domain',
 *      }
 *    }
 */
export const getNameFromProxyConfig = (
  config: ConfigOptions
): string => {
  if (config.name) {
    return config.name
  }

  if (typeof config.target === 'string') {
    return config.target
  } else {
    return url.format(config.target)
  }
}
