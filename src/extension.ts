// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { formatFileTreeItemsFromDirectory } from './lib/directory';
import { generate } from './lib/generator';
import { getUserEOL } from './utils';
import { formatFileTreeItemsFromText } from './lib/text';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ascii-tree-generator" is now active!');
	
	function registerCommand(cmd: string, callback: any) {
		context.subscriptions.push(
			vscode.commands.registerCommand(cmd, callback),
		);
	}
	
	registerCommand('extension.asciiTreeGenerator', async (resource: any) => {
		// Create and show a new webview
		// const panel = vscode.window.createWebviewPanel(
		// 	'AsciiTreeGenerator', // Identifies the type of the webview. Used internally
		// 	'Ascii Tree', // Title of the panel displayed to the user
		// 	vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		// 	{
		// 		enableScripts: true,
		// 	}
		// );

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

	registerCommand('extension.asciiTreeGeneratorFromText', async (resource: any) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || editor.selection.isEmpty) {
			vscode.window.showWarningMessage('No text selected. Please select text in editor before generating Tree Strings!');
			return;
		}
		//	find and select lines where current selection range locates
		const start = editor.selection.start.line;
		const end = editor.selection.end.line;
		const endLineSize = editor.document.lineAt(end).text.length;

		const range = editor.document.validateRange(new vscode.Range(
			new vscode.Position(start, 0),
			new vscode.Position(end, endLineSize),
		));
		editor.selection = new vscode.Selection(range.start, range.end);

		//	generate text and replace...
		const rawText = editor.document.getText(range);
		const items = formatFileTreeItemsFromText(rawText);
		const text = generate(items, {
			eol: editor.document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n',
			// Todo: read plugin configurations
		});
		editor.edit((edit) => {
			edit.replace(editor.selection, text);
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
