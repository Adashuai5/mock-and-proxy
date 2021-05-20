import * as vscode from 'vscode'

const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
)

export const updateStatusBar = (text?: string, command?: string) => {
  if (command !== undefined) {
    statusBarItem.command = command
  }
  if (text) {
    statusBarItem.text = `${text}`
    statusBarItem.show()
  } else {
    statusBarItem.hide()
  }
}
