import * as vscode from 'vscode';
import { PetViewProvider } from './petViewProvider';
import { startActivityTracker, saveActivity, resetActivity } from './activityTracker';
import { startMoodManager } from './moodManager';
import { startGitTracker } from './gitTracker';

export function activate(context: vscode.ExtensionContext) {
  const petView = new PetViewProvider(context.extensionUri);

  startActivityTracker(context);
  startMoodManager(context, (mood) => petView.setMood(mood));
  startGitTracker(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('codePet.petView', petView),
    vscode.commands.registerCommand('codePet.show', () => {
      vscode.commands.executeCommand('codePet.petView.focus');
    }),
    vscode.commands.registerCommand('codePet.reset', async () => {
      const answer = await vscode.window.showWarningMessage(
        'Reset Code Pet? This clears the saved activity.',
        { modal: true },
        'Reset'
      );
      if (answer === 'Reset') {
        await resetActivity();
      }
    })
  );
}

export function deactivate() {
  return saveActivity();
}
