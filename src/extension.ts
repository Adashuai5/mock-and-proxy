import * as vscode from 'vscode'
import { runServer } from './core/Command'
import { getConfiguration } from './core/Configuration'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Mock And Proxy" is now active!')

  // 默认自动启动
  if (getConfiguration('mock.autoServer')) {
    runServer()
  }

  const disposable = vscode.commands.registerCommand(
    'mockProxy.startMock',
    runServer
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
