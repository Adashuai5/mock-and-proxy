import * as vscode from 'vscode'

const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
)
export const updateStatusBar = (
  text?: string,
  title?: string,
  command?: string
) => {
  if (command !== undefined) {
    statusBarItem.command = command
  }
  if (!title) {
    title = 'mock'
  }
  if (text) {
    statusBarItem.text = `${title}:${text}`
    statusBarItem.show()
  } else {
    statusBarItem.hide()
  }
}
