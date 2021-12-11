import * as vscode from "vscode";
import clearCache from "./commands/clearCache";
import getInput from "./commands/getInput";
import login from "./commands/login";
import logout from "./commands/logout";
import { aocInputViewerSchema } from "./constants";
import { InputViewer } from "./views/inputViewer";
import { SidebarDataProvider } from "./views/sidebar";

export function activate(context: vscode.ExtensionContext) {
  // Register Commands
  context.subscriptions.push(
    vscode.commands.registerCommand("advent-of-code.login", (args) =>
      login(context, args)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("advent-of-code.logout", (args) =>
      logout(context, args)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("advent-of-code.openInput", (...args) =>
      getInput(context, args)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("advent-of-code.clearCache", () =>
      clearCache(context)
    )
  );

  // Register Internal Command to open input viewer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "advent-of-code.openInputWindow",
      async (uri) => {
        if (uri) {
          let doc = await vscode.workspace.openTextDocument(uri);
          await vscode.window.showTextDocument(doc, { preview: false });
        }
      }
    )
  );

  // Register AoC input viewer and schema
  vscode.workspace.registerTextDocumentContentProvider(
    aocInputViewerSchema,
    new InputViewer(context)
  );

  // Register Editor sidebar treeview
  vscode.window.registerTreeDataProvider(
    "aocSidebar",
    new SidebarDataProvider()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
