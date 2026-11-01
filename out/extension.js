"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const petViewProvider_1 = require("./petViewProvider");
function activate(context) {
    const petView = new petViewProvider_1.PetViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('codePet.petView', petView), vscode.commands.registerCommand('codePet.show', () => {
        vscode.commands.executeCommand('codePet.petView.focus');
    }));
}
//# sourceMappingURL=extension.js.map