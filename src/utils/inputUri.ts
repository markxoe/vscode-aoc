import * as vscode from "vscode";
import { aocInputViewerSchema } from "../constants";

// Parse and URI from the AoC input viewer Schema
export const parseUri = (uri: vscode.Uri) => {
  if (uri.scheme === aocInputViewerSchema) {
    const [year, day] = uri.path.split("-");
    if (parseInt(year) !== NaN && parseInt(day) !== NaN) {
      return { year: parseInt(year), day: parseInt(day) };
    } else {
      return undefined;
    }
  }
};

// Assemble URI for the AoC input viewer
export const assembleUri = (year: number, day: number) => {
  return vscode.Uri.parse(`${aocInputViewerSchema}:${year}-${day}`);
};
