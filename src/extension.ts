// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
// import * as fs from 'fs';

import { formatFileTreeItemsFromDirectory } from './lib/directory';
import { generate } from './lib/generator';
import { getUserEOL, createWebview, revertTreeString } from './utils';
import { formatFileTreeItemsFromText } from './lib/text';

export function activate(context: vscode.ExtensionContext) {
	function registerCommand(cmd: string, callback: any) {
		context.subscriptions.push(
			vscode.commands.registerCommand(cmd, callback),
		);
	}

	registerCommand('extension.asciiTreeGenerator', async (resource: any) => {
		const workspaces = vscode.workspace.workspaceFolders;
		const rootWorkspace: vscode.WorkspaceFolder | undefined = workspaces ? workspaces[0] : undefined;
		if (!rootWorkspace) {
			vscode.window.showWarningMessage('Ascii Tree Generator need to be used with valid workspace folder!');
			return;
		}
		//	if no selected resource found, then try to get workspace root path
		const target: vscode.Uri = resource || rootWorkspace.uri;
		const root = path.relative(rootWorkspace.uri.fsPath, target.fsPath) || '.';

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

		createWebview(context, text);
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
		createWebview(context, text);
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

	registerCommand('extension.asciiTreeGeneratorRevertToText', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('Please open the file you want to revert!');
			return;
		}
		const text = editor.document.getText();
		const reverted = revertTreeString(text);
		const firstLine = editor.document.lineAt(0);
		const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
		const range = new vscode.Range(
			0,
			firstLine.range.start.character,
			editor.document.lineCount - 1,
			lastLine.range.end.character,
		);
		editor.edit((edit) => {
			edit.replace(range, reverted);
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
