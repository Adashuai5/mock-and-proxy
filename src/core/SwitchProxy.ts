import * as fs from 'fs'
import * as url from 'url'
import * as vscode from 'vscode'
import { getConfiguration } from './Configuration'
import { updateStatusBar } from './StatusBar'
import { mergeProxyConfig } from './Server'
import { setupProxy, runMockServer } from './Server'

// 切换代理时的可用操作
enum ACTION_ENUM {
  // 自定义配置
  custom,
  // 使用 mock
  mock,
}

/**
 * 切换代理
 * 1. 每次都获取最新的配置
 * 2. 将获取到的配置转换成可用的格式 - 适配层
 * 3. 用户选择进行的操作：1. 自定义配置；2. Mock；3. 根据配置切换代理
 * 4. 执行用户选择的具体操作
 */
export const switchProxy = async () => {
  const configPath = getConfiguration('proxy.configPath')
  const mockRootDir = getConfiguration('mock.rootDir')
  let targets = []
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    targets = config.targets
  } catch {
    targets = []
  }

  targets = targets.map(mergeProxyConfig)

  const target = await vscode.window.showQuickPick(
    [
      {
        label: '自定义',
        description: '使用自定义的 protocol//ip:port',
        target: ACTION_ENUM.custom,
      },
      { label: 'Mock', description: mockRootDir, target: ACTION_ENUM.mock },
      ...targets.map((config: any) => {
        return {
          label: getNameFromProxyConfig(config),
          description: config.target,
          target: config,
        }
      }),
    ],
    { placeHolder: '选择代理目标' }
  )
  if (!target) {
    return
  }

  switch (target.target) {
    // 使用自定义配置
    case ACTION_ENUM.custom: {
      const value = await vscode.window.showInputBox({
        placeHolder: '例如：http://192.168.0.1:10088',
      })
      if (!value) {
        return
      }
      setupProxy(value)
      updateStatusBar(value)
      break
    }
    // 使用 mock
    case ACTION_ENUM.mock:
      runMockServer()
      updateStatusBar('mock')
      break
    // 切换 proxy
    default:
      setupProxy(target.target)
      updateStatusBar(getNameFromProxyConfig(target.target))
  }
}

export type ServerOptions =
  | {
      target: string
    }
  | {
      target: {
        name: string
        target: string
      }
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
const getNameFromProxyConfig = (config: ServerOptions | any): string => {
  if (config.name) {
    return config.name
  }

  if (typeof config.target === 'string') {
    return config.target
  } else {
    return url.format(config.target)
  }
}
