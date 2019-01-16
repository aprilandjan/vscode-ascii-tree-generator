import * as vscode from 'vscode';

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