import * as vscode from 'vscode'
import * as apiServer from './Server'
import { updateStatusBar } from './StatusBar'
import { switchProxy } from './SwitchProxy'

export const runServer = () => {
  vscode.window.setStatusBarMessage(
    '正在开启 mock server 服务',
    vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'Running...' },
      async () => {
        try {
          await apiServer.runMockServer()
          const commands = await vscode.commands.getCommands(true)
          const commandId = 'mockProxy.switchProxy'
          if (!commands.includes(commandId)) {
            vscode.commands.registerCommand(
              commandId,
              switchProxy
            )
          }
          updateStatusBar('mock', commandId)
        } catch (error) {
          vscode.window.showErrorMessage(`${error}`)
        }
      }
    )
  )
}
