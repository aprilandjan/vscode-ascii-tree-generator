import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * get user file eol setting. if not specific, behave defaultly according platform
 */
export function getUserEOL() {
  //  strange type definition of 'get'...
  const eol = vscode.workspace.getConfiguration('files').get('eol') as 'auto' | '\n' | '\r\n';
  if (!eol || eol === 'auto') {
    return process.platform === "win32" ? '\r\n' : '\n';
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
    'AsciiTreeGenerator',
    'Ascii Tree',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = fs.readFileSync(path.join(__dirname, '../static/webview.html'), 'utf8');
  panel.webview.postMessage({
    command: 'setText',
    payload: text,
  });
  //	listen webview messages
  panel.webview.onDidReceiveMessage(message => {
    const { command } = message;
    switch(command) {
      case 'copy':
        vscode.env.clipboard.writeText(text).then(() => {
          vscode.window.showInformationMessage('Copy to Clipboard Successfully.');
        });
        break;
    }
  }, null, context.subscriptions);

  panel.onDidChangeViewState(e => {
    const panel = e.webviewPanel;
    if (panel.active) {
      panel.webview.postMessage({
        command: 'setText',
        payload: text,
      });
    }
  }, null, context.subscriptions);
  
  return panel;
}