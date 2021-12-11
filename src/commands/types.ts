import { ExtensionContext } from "vscode";

// Boring typescript stuff. (I know this is bad but I will change this later)
// Todo: change this

export type Command<L extends Array<any> | undefined = undefined> = (
  context: ExtensionContext,
  args?: L
) => void | Promise<void>;
