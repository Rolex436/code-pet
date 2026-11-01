import * as vscode from 'vscode';
import { PetViewProvider } from './petViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const petView = new PetViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('codePet.petView', petView),
    vscode.commands.registerCommand('codePet.show', () => {
      vscode.commands.executeCommand('codePet.petView.focus');
    })
  );
}