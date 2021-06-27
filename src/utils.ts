import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ICharset, IVsCodeConfig } from './lib/interface';
import { getConfig } from './config';

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
  const config: IVsCodeConfig = getConfig();
  const charset: ICharset = {
    root: validateCharCode(config.rootCharCode, defaultCharset.root),
    child: validateCharCode(config.childCharCode, defaultCharset.child),
    last: validateCharCode(config.lastCharCode, defaultCharset.last),
    parent: validateCharCode(config.parentCharCode, defaultCharset.parent),
    dash: validateCharCode(config.dashCharCode, defaultCharset.dash),
    blank: validateCharCode(config.blankCharCode, defaultCharset.blank),
  };
  return charset;
}

export function getDirectoryIgnoreFromConfig(): string[] {
  const { directoryIgnore }: IVsCodeConfig = getConfig();
  if (Array.isArray(directoryIgnore)) {
    return directoryIgnore.filter(item => typeof item === 'string');
  }
  return defaultDirectoryIgnore;
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
