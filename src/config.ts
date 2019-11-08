import * as vscode from 'vscode';
import { IVsCodeConfig } from './lib/interface';

export function getConfig(): IVsCodeConfig {
  let config: IVsCodeConfig = {
    ignore: [
      'node_modules'
    ],
    rootCharCode: vscode.workspace.getConfiguration().get<number>("Root element character code"),
    childCharCode: vscode.workspace.getConfiguration().get<number>("Child element character code"),
    lastCharCode: vscode.workspace.getConfiguration().get<number>("Last element character code"),
    parentCharCode: vscode.workspace.getConfiguration().get<number>("Parent element character code"),
    dashCharCode: vscode.workspace.getConfiguration().get<number>("Dash element character code"),
    blankCharCode: vscode.workspace.getConfiguration().get<number>("Blank element character code")
  };
  return config;
}

