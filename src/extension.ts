import * as vscode from 'vscode';
import { PetViewProvider } from './petViewProvider';
import { startActivityTracker, getActivity, saveActivity } from './activityTracker';

export function activate(context: vscode.ExtensionContext) {
  const petView = new PetViewProvider(context.extensionUri);
  startActivityTracker(context);

  const tempLog = setInterval(() => console.log('activity', getActivity().toFixed(1)), 2000);
  context.subscriptions.push({ dispose: () => clearInterval(tempLog) });

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('codePet.petView', petView),
    vscode.commands.registerCommand('codePet.show', () => {
      vscode.commands.executeCommand('codePet.petView.focus');
    })
  );
}

export function deactivate() {
  return saveActivity ();
}