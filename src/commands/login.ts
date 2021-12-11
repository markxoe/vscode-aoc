import * as vscode from "vscode";
import { Command } from "./types";
import axios, { AxiosError } from "axios";

import { URL } from "url";
import { sessionTokenKey } from "../constants";

// This command let's the user login
const login: Command = (context) => {
  // First let the user get their session cookie
  vscode.window
    .showInputBox({
      prompt:
        'Log into https://adventofcode.com and get the browser "session" cookie content and paste it here',
      title: "Advent of code Session cookie content",
    })
    .then(async (i) => {
      if (i) {
        // If the user provided the cookie we can try to login and check if we get redirected from the settings to the homepage (thats bad) or not (that'd be good)
        axios
          .get("https://adventofcode.com/settings", {
            headers: { cookie: `session=${i};` },
          })
          .then((data) => {
            if (data.request?.res?.responseUrl) {
              // Get our url we are at
              const url = new URL(data.request?.res?.responseUrl);

              // If it ends with "settings" we know we are logged in, if not we know we are not.
              if (!url.pathname.endsWith("settings")) {
                vscode.window.showErrorMessage("Authentication unsuccessful");
              } else {
                // So it ends with "settings" so save that cookie
                context.secrets.store(sessionTokenKey, i);
                vscode.window.showInformationMessage(
                  "Authentication successful"
                );
              }
            } else {
              vscode.window.showErrorMessage(
                `Something is not right, see console for more`
              );
              console.error(
                "Axios returned us",
                data,
                "But we need request.res.responseUrl"
              );
            }
          })
          .catch((e: AxiosError) =>
            vscode.window.showErrorMessage(
              "Error trying to login. Are you offline?"
            )
          );
      } else {
        vscode.window.showErrorMessage("No session cookie provided");
      }
    });
};

export default login;
