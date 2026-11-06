import * as vscode from 'vscode';
import { triggerExcited } from './moodManager';

type GitRepo = {
  onDidCommit: vscode.Event<void>;
};

type GitApi = {
  repositories: GitRepo[];
  onDidOpenRepository: vscode.Event<GitRepo>;
};

export async function startGitTracker(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    return;
  }

  const gitExports = await gitExtension.activate();
  const gitApi: GitApi = gitExports.getAPI(1);

  function watchRepo(repo: GitRepo) {
    context.subscriptions.push(
      repo.onDidCommit(() => {
        const reactionsOn = vscode.workspace
          .getConfiguration('codePet')
          .get<boolean>('gitReactions', true);
        if (reactionsOn) {
          triggerExcited();
        }
      })
    );
  }

  gitApi.repositories.forEach(watchRepo);
  context.subscriptions.push(gitApi.onDidOpenRepository(watchRepo));
}