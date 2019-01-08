// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { } from './lib/directory';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "ascii-tree-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.asciiTreeGenerator', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// Todo: if currently not opened with some directory, give message
		if (Math.random() > 1) {
			vscode.window.showWarningMessage('Ascii Tree Generator need to when opened with directory');
			return;
		}
		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'AsciiTreeGenerator', // Identifies the type of the webview. Used internally
			'Ascii Tree', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
			}
		);

		//	listen webview messages
		panel.webview.onDidReceiveMessage(message => {
			const { command, payload } = message;
			switch(command) {
				case 'copy':
					console.log('copy...', payload);
					break;
			}
		}, undefined, context.subscriptions);

		// And set its HTML content
		// Todo: create current project folder
		panel.webview.html = fs.readFileSync(path.join(__dirname, '../static/webview.html'), 'utf8');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
