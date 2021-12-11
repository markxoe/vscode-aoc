import * as vscode from "vscode";
import { Command } from "./types";
import { sessionTokenKey } from "../constants";

// Well, we log out with this command
const logout: Command = (context) => {
  context.secrets.delete(sessionTokenKey);
  vscode.window.showInformationMessage("Logged out");
};

export default logout;
