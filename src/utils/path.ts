import * as path from 'path'

/**
 * windows 的路径兼容处理 posix 转 windows
 */
export function compatibleWithPath(str: string): string {
  if (!str) {
    return str
  }

  return str.replace('/', path.sep)
}
