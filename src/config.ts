import * as vscode from 'vscode';
import { IVsCodeConfig } from './lib/interface';

export function getConfig(): IVsCodeConfig {
  let config: IVsCodeConfig = {
    ignore: [
      'node_modules'
    ],
    rootCharCode: vscode.workspace.getConfiguration().get<number>("Root element caracter code"),
    childCharCode: vscode.workspace.getConfiguration().get<number>("Child element caracter code"),
    lastCharCode: vscode.workspace.getConfiguration().get<number>("Last element caracter code"),
    parentCharCode: vscode.workspace.getConfiguration().get<number>("Parent element caracter code"),
    dashCharCode: vscode.workspace.getConfiguration().get<number>("Dash element caracter code"),
    blankCharCode: vscode.workspace.getConfiguration().get<number>("Blank element caracter code")
  };
  return config;
}

