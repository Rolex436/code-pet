import * as vscode from 'vscode';
import { getActivity, getLastActiveTime } from './activityTracker';

const excitedLimit = 80;
const commitExcitedMs = 10000;

let currentMood = 'happy';
let excitedUntil = 0;

function pickMood() {
  const now = Date.now();

  if (now < excitedUntil) {
    return 'excited';
  }
  if (getActivity() > excitedLimit) {
    return 'excited';
  }

  const idleSeconds = vscode.workspace
    .getConfiguration('codePet')
    .get<number>('idleTimeoutSeconds', 300);
  const secondsSinceActive = (now - getLastActiveTime()) / 1000;

  if (secondsSinceActive < idleSeconds) {
    return 'happy';
  }
  if (secondsSinceActive < idleSeconds * 3) {
    return 'idle';
  }
  return 'sleepy';
}

export function startMoodManager(
  context: vscode.ExtensionContext,
  onMoodChange: (mood: string) => void
) {
  const moodTimer = setInterval(() => {
    const newMood = pickMood();
    if (newMood !== currentMood) {
      currentMood = newMood;
      onMoodChange(newMood);
    }
  }, 1000);

  context.subscriptions.push({ dispose: () => clearInterval(moodTimer) });
}

export function triggerExcited() {
  excitedUntil = Date.now() + commitExcitedMs;
}

