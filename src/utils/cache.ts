import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// Simple caching of the AoC inputs
class Cache {
  private context: vscode.ExtensionContext;
  private cacheDir: string;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    this.cacheDir = path.join(
      this.context.globalStorageUri.fsPath.toString(),
      "/aoc-cache/"
    );
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  setDaysInput(year: number, day: number, input: string) {
    const filePath = this.daysFilePath(year, day);
    fs.writeFileSync(filePath, input, "utf8");
  }

  hasDaysInput(year: number, day: number) {
    return fs.existsSync(this.daysFilePath(year, day));
  }

  getDaysInput(year: number, day: number) {
    if (this.hasDaysInput(year, day)) {
      return fs.readFileSync(this.daysFilePath(year, day)).toString();
    } else {
      return undefined;
    }
  }

  clearCache() {
    fs.rmSync(this.cacheDir, { recursive: true });
  }

  private daysFilePath(year: number, day: number) {
    return path.join(this.cacheDir, `${year}-${day}.input`);
  }
}

export default Cache;
