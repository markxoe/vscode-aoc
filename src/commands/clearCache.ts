import * as vscode from "vscode";
import { Command } from "./types";
import Cache from "../utils/cache";

// Command do clear the cache
const clearCache: Command = (context) => {
  const cache = new Cache(context);
  cache.clearCache();

  vscode.window.showInformationMessage("Cache has been cleared");
};

export default clearCache;
