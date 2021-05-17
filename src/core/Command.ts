import * as vscode from 'vscode'
import * as apiServer from './Server'

const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
)
export const updateStatusBar = (text?: string, command?: string) => {
  if (command !== undefined) {
    statusBarItem.command = command
  }
  if (text) {
    statusBarItem.text = `mock:${text}`
    statusBarItem.show()
  } else {
    statusBarItem.hide()
  }
}

export const runServer = () => {
  vscode.window.setStatusBarMessage(
    '正在开启 mock server 服务',
    vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'Running...' },
      async () => {
        try {
          await apiServer.runMockServer()
          const commands = await vscode.commands.getCommands(true)
          const commandId = 'vscodeMock.switchProxy'
          if (!commands.includes(commandId)) {
            vscode.commands.registerCommand(commandId, () => {})
          }
          updateStatusBar('mock', commandId)
        } catch (error) {
          vscode.window.showErrorMessage(`${error}`)
        }
      }
    )
  )
}
