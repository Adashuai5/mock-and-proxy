// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { runServer } from './core/Command'
import { getConfiguration } from './core/Configuration'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Mock And Proxy" is now active!')

  if (getConfiguration('mock.autoServer')) {
    runServer()
  }

  const disposable = vscode.commands.registerCommand(
    'mockProxy.startMock',
    runServer
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
