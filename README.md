# [ascii tree generator](https://marketplace.visualstudio.com/items?itemName=aprilandjan.ascii-tree-generator)

[![Build Status](https://dev.azure.com/merlinye/ascii-tree-generator/_apis/build/status/aprilandjan.ascii-tree-generator?branchName=master)](https://dev.azure.com/merlinye/ascii-tree-generator/_build/latest?definitionId=1?branchName=master)

A VS Code extension to generate ascii tree of directories or format selected text to tree strings.

## Usage

This extension provides convenient way to generate ascii tree strings for directory in workspace explorer. Besides, you can select text in editor and format it to tree strings easily.

### Format Text to Tree Strings

Write simple tree lines in certain syntax (see example below), select these lines, right-click on text and click `Format Text to Tree Strings` menu:

![Format Text to Tree Strings](./images/text.gif)

The following kinds of line syntax is supported to correctly format to tree strings:

- lines started with `indent(space or tab)` characters:

  ```
  public
  dist
    index.d.ts
    index.js
  src
    index.ts
  ```

- line started with `hash(#)` symbol

  ```
  # public
  # dist
  ## index.d.ts
  ## index.js
  # src
  ## index.ts
  ```

They should be formatted to:

```
.
├── public
├── dist
│   ├── index.d.ts
│   └── index.js
└── src
    └── index.ts
```

**Note**: In most cases, you can just simply undo the formatting operation using the vscode editor `undo` ability. The default shortcut is <kbd>cmd</kbd>+<kbd>Z</kbd>. Besides,
You can open the VS Code `Command Palette` and execute `Revert Tree Strings to Text` to revert tree strings back to hash-style texts, in case that your undo history is lost for some reason.

### Generate Tree Strings for Directory

Right-click on `Explorer` directories, click `Generate Tree Strings for Directory` menu:

![Generate Tree Strings for Directory](./images/directory.gif)

**Note**: This process of walking through files is asynchronous. So if you include some heavy-nested folders, `node_modules` for example, the result will be slow to show.

## Configuration

Not available yet...

## Issues & Contribution

Please feel free to submit issues if you have any questions. Contribution is also welcomed :)
