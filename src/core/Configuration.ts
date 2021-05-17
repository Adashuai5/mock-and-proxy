import * as vscode from 'vscode'

const workspaceFolders = vscode.workspace.workspaceFolders

const replacement: Map<RegExp, string> = new Map([])

if (workspaceFolders) {
  replacement.set(/\$\{workspaceFolder\}/, workspaceFolders[0].uri.fsPath)
}

const replacePlaceholder = (text: string) => {
  for (let [k, v] of replacement) {
    if (k.test(text)) {
      return text.replace(k, v)
    }
  }
  return text
}

export const getConfiguration = (key: string): any => {
  const property = vscode.workspace
    .getConfiguration('mockProxy')
    .get<string>(key)

  if (property) {
    return replacePlaceholder(property)
  }
  return ''
}
