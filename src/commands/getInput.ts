import * as vscode from "vscode";
import { Command } from "./types";
import { getInputWithCaching } from "../api/getInput";
import { firstAoC, sessionTokenKey } from "../constants";
import { assembleUri, parseUri } from "../utils/inputUri";
import { getDay, getYear, isDecember } from "../utils/time";

// Todo: ask the user if they don't it in an separate window or save it to disk or whatever
// export enum WhatToDo {
//   open,
//   savetofile,
//   copytoclip,
// }

// So this command will get the input of an day and open it with the internal command
const getInput: Command<any[]> = async (context, args) => {
  // First, if we don't have an token we will die here
  const sessionCookie = await context.secrets.get(sessionTokenKey);
  if (!sessionCookie) {
    vscode.window.showErrorMessage("You are not logged in");
    return;
  }
  // This wrapper will allow us to use such a fancy progress thingy
  vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification },
    async (progress) => {
      progress.report({ message: "Fetching Day..." });

      // Get the year and day of the desired Input
      let year = 0;
      let day = 0;

      // On the sidebar, the user can click on any date and well we parse that here
      if (
        args &&
        (args[0] as vscode.Uri) instanceof vscode.Uri &&
        parseUri(args[0])
      ) {
        const uriContent = parseUri(args[0]);
        if (uriContent) {
          year = uriContent.year;
          day = uriContent.day;
        }
      } else {
        // If the user didn't click on such an fancy thingy, we will just ask the user for data
        const pickedYear = await vscode.window.showQuickPick(
          Array(getYear() - firstAoC + 1)
            .fill(0)
            .map((_, year) => String(year + firstAoC)),
          { title: "Year", placeHolder: "Select a year" }
        );

        if (pickedYear) {
          year = parseInt(pickedYear);
        } else {
          return;
        }

        const pickedDay = await vscode.window.showQuickPick(
          Array(year === getYear() && isDecember() ? getDay() : 25)
            .fill(0)
            .map((_, day) => String(day + 1)),
          { title: "Day", placeHolder: "Select a day" }
        );

        if (pickedDay) {
          day = parseInt(pickedDay);
        } else {
          return;
        }
      }

      // We now have everything we need so we will increase our progress to 10%
      progress.report({ increment: 10 });

      // Then we will fetch the input for this day. This is not really needed, but then our input viewer doesn't need to handle this stuff
      await getInputWithCaching(context, year, day);

      // Now we have Everything done
      progress.report({ increment: 100, message: "Got Days" });

      // Okay not really, we have to open the input viewer thingy
      vscode.commands.executeCommand(
        "advent-of-code.openInputWindow",
        assembleUri(year, day)
      );
      // But now we are done
    }
  );
};

export default getInput;
