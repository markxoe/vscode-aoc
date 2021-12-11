import * as vscode from "vscode";
import { firstAoC } from "../constants";
import { assembleUri } from "../utils/inputUri";
import { getDay, getYear, isDecember } from "../utils/time";

// This file displays the Advent of code section in the editor

enum SidebarItemType {
  year,
  day,
}

interface SidebarItemProps {
  year?: number;
  day?: number;
}

// This is one of our items displayed in sidebar
// It has an type which determines what it does and what it shows
// We propably could just make multiple TreeItems
export class SideBarItem extends vscode.TreeItem {
  public type: SidebarItemType;

  public props: SidebarItemProps;

  constructor(
    type: SidebarItemType,
    options: SidebarItemProps,
    collabsibleState?: vscode.TreeItemCollapsibleState
  ) {
    let label = "";
    switch (type) {
      case SidebarItemType.year:
        label = `AoC ${options.year}`;
        break;
      case SidebarItemType.day:
        label = `Day ${options.day}`;
    }
    super(label, collabsibleState);

    switch (type) {
      case SidebarItemType.day:
        this.command = {
          command: "advent-of-code.openInput",
          arguments: [assembleUri(options.year!, options.day!)],
          title: "Open Input",
        };
    }

    this.type = type;
    this.props = options;
  }
}

// This is our tree provider used by VSCode
// May explain it later
// Todo: Explain this more
export class SidebarDataProvider
  implements vscode.TreeDataProvider<SideBarItem>
{
  private getYears(): SideBarItem[] {
    const out = [];
    for (let year = getYear(); year >= firstAoC; year--) {
      out.push(
        new SideBarItem(
          SidebarItemType.year,
          { year },
          year === getYear()
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.Collapsed
        )
      );
    }
    return out;
  }

  private getDays(year: number): SideBarItem[] {
    return Array(year === getYear() && isDecember() ? getDay() : 25)
      .fill(undefined)
      .map(
        (_, day) => new SideBarItem(SidebarItemType.day, { day: day + 1, year })
      );
  }

  getChildren(element?: SideBarItem): vscode.ProviderResult<SideBarItem[]> {
    if (!element) {
      return this.getYears();
    } else {
      switch (element.type) {
        case SidebarItemType.year:
          return this.getDays(element.props.year!);
      }
    }
  }

  getTreeItem(element: SideBarItem) {
    return element;
  }
}
