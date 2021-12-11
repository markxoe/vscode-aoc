import { AxiosError } from "axios";
import * as vscode from "vscode";
import { getInputWithCaching } from "../api/getInput";
import { sessionTokenKey } from "../constants";
import { parseUri } from "../utils/inputUri";

// This is the input viewer. This is the code for the window that opens when getting and input from AoC
// We use this as it is read-only (that's nice) and because we use it. Yes
export class InputViewer implements vscode.TextDocumentContentProvider {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  provideTextDocumentContent(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<string> {
    return this.getData(uri);
  }

  private async getData(uri: vscode.Uri) {
    if (!(await this.context.secrets.get(sessionTokenKey))) {
      return "You are not logged in";
    }

    // Soooo, we get our URI and parse it
    const date = parseUri(uri);
    if (date) {
      // If the URI was good we can get the data from the cache or AoC

      return getInputWithCaching(this.context, date.year, date.day).catch(
        (e: AxiosError) => {
          vscode.window.showErrorMessage(
            `Error getting data, ${e.message} ${e.response?.status} ${e.response?.data}`
          );
          return "Error getting data";
        }
      );
    } else {
      // If something is not right we dont care about it and tell the user.
      vscode.window.showErrorMessage("No date provided");
      return "Something is not right here :(";
    }
  }
}
