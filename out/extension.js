"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const petViewProvider_1 = require("./petViewProvider");
const activityTracker_1 = require("./activityTracker");
function activate(context) {
    const petView = new petViewProvider_1.PetViewProvider(context.extensionUri);
    (0, activityTracker_1.startActivityTracker)(context);
    const tempLog = setInterval(() => console.log('activity', (0, activityTracker_1.getActivity)().toFixed(1)), 2000);
    context.subscriptions.push({ dispose: () => clearInterval(tempLog) });
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('codePet.petView', petView), vscode.commands.registerCommand('codePet.show', () => {
        vscode.commands.executeCommand('codePet.petView.focus');
    }));
}
function deactivate() {
    return (0, activityTracker_1.saveActivity)();
}
//# sourceMappingURL=extension.js.map