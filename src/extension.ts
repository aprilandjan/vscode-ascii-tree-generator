// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { formatFileTreeItemsFromDirectory } from './lib/directory';
import { generate } from './lib/generator';
import { getUserEOL } from './utils';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ascii-tree-generator" is now active!');
	
	function registerCommand(cmd: string, callback: any) {
		context.subscriptions.push(
			vscode.commands.registerCommand(cmd, callback),
		);
	}
	
	registerCommand('extension.asciiTreeGenerator', async (resource: any) => {
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
		// panel.webview.onDidReceiveMessage(message => {
		// 	const { command, payload } = message;
		// 	switch(command) {
		// 		case 'copy':
		// 			console.log('copy...', payload);
		// 			break;
		// 	}
		// }, undefined, context.subscriptions);

		// And set its HTML content
		// Todo: create current project folder
		// panel.webview.html = fs.readFileSync(path.join(__dirname, '../static/webview.html'), 'utf8');

		const workspaces = vscode.workspace.workspaceFolders;
		const root = workspaces ? workspaces[0] : undefined;
		if (!root) {
			// Todo: give message box
			console.log('no root found');
			return;
		}
		const items = await formatFileTreeItemsFromDirectory(root.uri.fsPath);
		const text = generate(items, {
			eol: '\r\n',
		});
		panel.webview.html = `<pre>${text}</pre>`;
	});
	
	//	create ascii tree from directory
	registerCommand('extension.asciiTreeGeneratorFromDirectory', async (resource: vscode.Uri | undefined) => {
		const workspaces = vscode.workspace.workspaceFolders;
		const rootWorkspace: vscode.WorkspaceFolder | undefined = workspaces ? workspaces[0] : undefined;
		if (!rootWorkspace) {
			vscode.window.showWarningMessage('Ascii Tree Generator need to be used with valid workspace folder!');
			return;
		}
		//	if no selected resource found, then try to get workspace root path
		const target: vscode.Uri = resource || rootWorkspace.uri;
		const root = path.relative(rootWorkspace.uri.fsPath, target.fsPath) || '.';

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'AsciiTreeGenerator', // Identifies the type of the webview. Used internally
			'Ascii Tree', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		);
		// Todo: read plugin configuration
		const items = await formatFileTreeItemsFromDirectory(target!.fsPath, {
			maxDepth: Number.MAX_VALUE,
			sort: true,
			ignore: [],
		});
		const text = generate(items, {
			eol: getUserEOL(),
			root,
		});
		panel.webview.html = `<pre>${text}</pre>`;
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
