import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ICharset, IVsCodeConfig } from './lib/interface';
import { getConfig } from './config';
import * as parseGitignore from 'parse-gitignore';
const ONE_DEEP_CHARACTER_LENGTH = 4;
let isInTestMode = false;

export const defaultCharset: ICharset = {
  root: String.fromCharCode(46), // '.',
  child: String.fromCharCode(9500), // '├',
  last: String.fromCharCode(9492), // '└',
  parent: String.fromCharCode(9474), // '|',
  dash: String.fromCharCode(9472), // '─',
  blank: String.fromCharCode(32), // ' ',
};

export const defaultDirectoryIgnore: string[] = [
  'node_modules',
  '.git',
];

/**
 * get user file eol setting. if not specific, behave defaultly according platform
 */
export function getUserEOL() {
  //  strange type definition of 'get'...
  const eol = vscode.workspace.getConfiguration('files').get('eol') as
    | 'auto'
    | '\n'
    | '\r\n';
  if (!eol || eol === 'auto') {
    return process.platform === 'win32' ? '\r\n' : '\n';
  }
  return eol;
}
/**
 * get comment in file
 * @param name file name
 * @param dir file dir path
 * @returns common string
 */
export function getCommentInFile(
  name: string,
  dir?: string
): string | undefined {
  const absolutePath = path.join(dir || process.cwd(), name);
  try {
    const fileString = getStringFromFile(absolutePath);
    const commonString = getCommentInFileString(fileString);
    return commonString;
  }
  catch (e) {
    return undefined;
  }
}
/**
 * get tree string item character length
 * @param deep tree string item deep
 * @param name file name
 * @returns character length
 */
export function getTreeStringItemCharacterLength(deep: number, name: string): number {
  return deep * ONE_DEEP_CHARACTER_LENGTH + calculateStringLength(name);
}

export function checkCharacterLength(char: string) {
  const regexChinese = /[\u4e00-\u9fa5]/;
  if (regexChinese.test(char)) {
    return 2;
  }
  else {
    return 1;
  }
}

export function calculateStringLength(str: string) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    length += checkCharacterLength(str[i]);
  }
  return length;
}

/**
 * get comment in file string
 * @param fileString file string
 * @returns comment
 */
export function getCommentInFileString(fileString: string): string | undefined {
  // get comment from tags @fileoverview @file @overview 
  const fileRegex = /@(file|fileoverview|overview)\s+(.+)/;
  const match = fileString.match(fileRegex);
  if (match) {
    return match[2].trim();
  } else {
    return undefined;
  }
}

export function isPathExists(p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}

export function getStringFromFile(filePath: string): string {
  if (!isPathExists(filePath)) return '';
  try {
    const fileString = fs.readFileSync(filePath, "utf8");
    return fileString;
  } catch (e) {
    return '';
  }
}

/**
 * create webview, with the ability to copy to clipboard, ect
 * @param text
 * @param context
 */
export function createWebview(context: vscode.ExtensionContext, text = '') {
  const panel = vscode.window.createWebviewPanel(
    'ASCII Tree Generator',
    'ASCII Tree',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = fs.readFileSync(
    path.join(__dirname, '../static/webview.html'),
    'utf8'
  );
  panel.webview.postMessage({
    command: 'setText',
    payload: text,
  });
  //	listen webview messages
  panel.webview.onDidReceiveMessage(
    (message) => {
      const { command } = message;
      switch (command) {
        case 'copy':
          vscode.env.clipboard.writeText(text).then(() => {
            vscode.window.showInformationMessage(
              'Copied to clipboard successfully!'
            );
          });
          break;
      }
    },
    null,
    context.subscriptions
  );

  panel.onDidChangeViewState(
    (e) => {
      const panel = e.webviewPanel;
      if (panel.active) {
        panel.webview.postMessage({
          command: 'setText',
          payload: text,
        });
      }
    },
    null,
    context.subscriptions
  );

  return panel;
}

/** create a revert regexp according to current config, and revert tree-string back */
export function revertTreeString(treeString: string, replaceWith = '#') {
  const { child, last, parent, dash, blank } = getCharCodesFromConfig();
  //  [└├]──|│ {3}|^( {4})+?|( {4})(?=.*[└├│])
  const reg = new RegExp(
    `[${last}${child}]${dash}${dash}|${parent}${blank}{3}|^(${blank}{4})+?|(${blank}{4})(?=.*[${last}${child}${parent}])`,
    'gm'
  );
  return treeString.replace(reg, replaceWith);
}

export function setTestMode() {
  console.info(
    'Test mode was enabled: The default charset will be used instead of the user-defined'
  );
  isInTestMode = true;
}

export function getCharCodesFromConfig(): ICharset {
  if (isInTestMode) {
    return defaultCharset;
  }
  const config = getConfig();
  const charset = {
    root: validateCharCode(config.rootCharCode, defaultCharset.root),
    child: validateCharCode(config.childCharCode, defaultCharset.child),
    last: validateCharCode(config.lastCharCode, defaultCharset.last),
    parent: validateCharCode(config.parentCharCode, defaultCharset.parent),
    dash: validateCharCode(config.dashCharCode, defaultCharset.dash),
    blank: validateCharCode(config.blankCharCode, defaultCharset.blank),
  };
  return charset;
}

export function getEnableCommentInFileFromConfig(): boolean {
  const { enableCommentInFile } = getConfig();
  return enableCommentInFile || false;
}

export function getDirectoryIgnoreFromGitignore(): string[] | undefined {
  const workspaces = vscode.workspace.workspaceFolders;
  const rootWorkspace: vscode.WorkspaceFolder | undefined = workspaces
    ? workspaces[0]
    : undefined;
  if (!rootWorkspace) {
    return undefined;
  }
  const gitignorePath = path.join(
    rootWorkspace.uri.fsPath,
    '.gitignore'
  );
  if (!isPathExists(gitignorePath)) {
    return undefined;
  }
  try {
    const gitignoreContent = getStringFromFile(gitignorePath);
    const gitignore = parseGitignore.parse(gitignoreContent).patterns;
    return gitignore;
  }
  catch (e) {
    return undefined;
  }
}

export function getDirectoryIgnoreFromConfig(): string[] {
  const { directoryIgnore }: IVsCodeConfig = getConfig();
  const directoryIgnoreInGitignore = getDirectoryIgnoreFromGitignore();
  if (Array.isArray(directoryIgnore) && directoryIgnore.length > 0) {
    return directoryIgnore.filter(item => typeof item === 'string');
  }
  if (Array.isArray(directoryIgnoreInGitignore) && directoryIgnoreInGitignore.length > 0) {
    return directoryIgnoreInGitignore.filter(item => typeof item === 'string');
  }
  return defaultDirectoryIgnore;
}

export function getDirectoryMaxDepthFromConfig(): number {
  const { directoryMaxDepth } = getConfig();
  if (directoryMaxDepth === 0 || !Number.isInteger(directoryMaxDepth)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return directoryMaxDepth!;
}

function validateCharCode(
  userValue: number | undefined,
  fallback: string
): string {
  if (typeof userValue === 'undefined' || userValue < 0 || userValue > 65535) {
    return fallback;
  } else {
    return String.fromCharCode(userValue);
  }
}
