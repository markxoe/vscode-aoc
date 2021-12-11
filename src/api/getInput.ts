import axios, { AxiosError } from "axios";
import * as vscode from "vscode";
import { sessionTokenKey } from "../constants";
import Cache from "../utils/cache";
import { trimInput } from "../utils/trimInput";

// Get raw input data
export const getInput = async (year: number, day: number, session: string) =>
  axios
    .get<string>(`/${year}/day/${day}/input`, {
      headers: { cookie: `session=${session};` },
      baseURL: "https://adventofcode.com",
      responseType: "text",
      transformResponse: [], // ! Don't remove me, else I will parse EVERYTHING (including numbers which is bad lmao)
    })
    .then((r) => trimInput(r.data));

// Get input and cache it. Errors handled
export const getInputWithCaching = async (
  context: vscode.ExtensionContext,
  year: number,
  day: number
): Promise<string | undefined> => {
  const cache = new Cache(context);

  if (cache.hasDaysInput(year, day)) {
    // If the data is in the cache return it and don't think about it
    return cache.getDaysInput(year, day);
  } else {
    // Else try to get it
    if (!(await context.secrets.get(sessionTokenKey))) {
      // If we dont have an token don't continue and tell the user to log in
      vscode.window.showErrorMessage("You are not logged in.");
      return undefined;
    }
    // Parse the data from AoC. On Error log it to the console and tell the user
    const input = await getInput(
      year,
      day,
      (await context.secrets.get(sessionTokenKey))!
    ).catch((e: AxiosError) => {
      console.error(e);
      vscode.window.showErrorMessage(
        `Error getting data, ${e.message} ${e.response?.status} ${e.response?.data}`
      );
    });

    // If there was an error return
    if (!input) {
      return undefined;
    }

    // If not save it into cache and return it
    cache.setDaysInput(year, day, input);
    return input;
  }
};
