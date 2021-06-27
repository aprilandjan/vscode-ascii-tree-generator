import * as vscode from 'vscode';
import { IVsCodeConfig } from './lib/interface';

export function getConfig(): IVsCodeConfig {
  const config: IVsCodeConfig = {
    directoryIgnore: vscode.workspace.getConfiguration().get<string[]>('asciiTreeGenerator.directoryIgnore'),
    rootCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.rootElement'),
    parentCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.parentElement'),
    childCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.childElement'),
    lastCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.lastElement'),
    dashCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.dashElement'),
    blankCharCode: vscode.workspace
      .getConfiguration()
      .get<number>('asciiTreeGenerator.blankElement'),
  };
  return config;
}
