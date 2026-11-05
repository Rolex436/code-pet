"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startActivityTracker = startActivityTracker;
exports.getActivity = getActivity;
exports.getLastActiveTime = getLastActiveTime;
exports.saveActivity = saveActivity;
const vscode = require("vscode");
const activityKey = 'codePet.activity';
const decayRate = 0.2;
const editPoints = 1;
const savePoints = 5;
const maxScore = 100;
let activityScore = 0;
let lastActiveTime = Date.now();
let activityNeedsSaving = false;
let globalStore;
function startActivityTracker(context) {
    globalStore = context.globalState;
    const savedActivity = globalStore.get(activityKey);
    if (savedActivity) {
        activityScore = savedActivity.score;
        lastActiveTime = savedActivity.lastActiveTime;
    }
    const saveTimer = setInterval(() => {
        if (activityNeedsSaving) {
            void saveActivity();
        }
    }, 5000);
    context.subscriptions.push({
        dispose: () => clearInterval(saveTimer)
    }, vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length === 0) {
            return;
        }
        const fileType = event.document.uri.scheme;
        if (fileType !== 'file' && fileType !== 'untitled') {
            return;
        }
        addActivity(editPoints);
    }), vscode.workspace.onDidSaveTextDocument(() => {
        addActivity(savePoints);
    }));
}
function getActivity() {
    const secondsInactive = (Date.now() - lastActiveTime) / 1000;
    const currentScore = activityScore - secondsInactive * decayRate;
    return Math.max(0, currentScore);
}
function getLastActiveTime() {
    return lastActiveTime;
}
async function saveActivity() {
    if (!globalStore || !activityNeedsSaving) {
        return;
    }
    activityNeedsSaving = false;
    try {
        await globalStore.update(activityKey, {
            score: activityScore,
            lastActiveTime
        });
    }
    catch (error) {
        activityNeedsSaving = true;
        console.error('Could not save activity:', error);
    }
}
function addActivity(points) {
    activityScore = Math.min(maxScore, getActivity() + points);
    lastActiveTime = Date.now();
    activityNeedsSaving = true;
}
//# sourceMappingURL=activityTracker.js.map