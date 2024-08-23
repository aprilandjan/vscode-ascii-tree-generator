# [VSCode ASCII Tree Generator](https://marketplace.visualstudio.com/items?itemName=aprilandjan.ascii-tree-generator)

[![Build Status](https://dev.azure.com/merlinye/ascii-tree-generator/_apis/build/status/aprilandjan.ascii-tree-generator?branchName=master)](https://dev.azure.com/merlinye/ascii-tree-generator/_build/latest?definitionId=1?branchName=master)
[![Download Count](https://img.shields.io/visual-studio-marketplace/d/aprilandjan.ascii-tree-generator)](https://marketplace.visualstudio.com/items?itemName=aprilandjan.ascii-tree-generator)
[![Download Count](https://img.shields.io/visual-studio-marketplace/i/aprilandjan.ascii-tree-generator)](https://marketplace.visualstudio.com/items?itemName=aprilandjan.ascii-tree-generator)

Generate ASCII tree of directories or format selected text into its corresponding "tree string" representation.

## Usage

Generate ASCII "tree strings" for any directory in the workspace explorer. Aside from that, you can also select pre-formatted text in the explorer and format it to its corresponding "tree string" easily.

### Format Selected Text to Tree String

Using the `#` (octothorpe/hash) character, you can specify the depth of the current element. After writing a few lines (see example below), select the targetted pre-formatted lines, right-click on the highlighted text selection, and click `Format to Tree String` menu option. This will replace the selected, pre-formatted text, into its corresponding "tree string" representation.

![Format Text to Tree String](./images/text.gif)

For clarity, each line of your target tree structure should begin with at least a single `#` (octothorpe/hash) character. At most, each line can only have one more additional `#` than any line above it. This will ensure proper formatting. By placing multiple `#` symbols, it is possible to designate the depth of a certain element.

#### Demonstration

**Pre-Formatted Tree String**

```txt
# public
# dist
## index.d.ts
## index.js
# src
## index.ts
```

**Formatted Tree String**

```txt
.
├── public
├── dist
│   ├── index.d.ts
│   └── index.js
└── src
  └── index.ts
```

#### Addendum

In cases where you would like to undo the formatting operation, simply use VSCode's editor `undo` option (`Edit`&rarr;`Undo`). You can optionally use the keybindings for undo as well (<kbd>⌘</kbd>+<kbd>Z</kbd> on Mac or <kbd>CTRL</kbd>+<kbd>Z</kbd> on Windows). However, this option will fail in cases where the `undo` operation is invalid (e.g. text inside downloaded materials).

In all cases, you can revert formatting tree strings back to their preformatted versions by selecting the formatted tree string, heading to the VSCode Command Pallete (<kbd>⌘</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> on Mac or <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> on Windows), and executing `Revert Tree String to Text`. As long as the matching lines up, this should provide back your intended pre-formatted tree string.

### Generate Tree String for Directory

In addition to being able to format pre-formatted tree strings, you may also generate tree strings for directories inside your current workspace (directories appearing in `Explorer` tab). To do so, right-click on any directory, or empty space, within the `Explorer` tab and select the `Generate Tree String for Directory` menu option. An example is shown below.

![Generate Tree String for Directory](./images/directory.gif)

#### Addendum

The walking process through files is performed asynchronously. Therefore, selecting heavily-nested folders (e.g. `node_modules`) will directly affect performance speed.

At first,`asciiTreeGenerator.directoryIgnore` will get `.gitignore` as default. However, this can be customized by setting `asciiTreeGenerator.directoryIgnore` in configurations. if no `.gitignore` file and `asciiTreeGenerator.directoryIgnore` setting `node_modules` and `.git` are ignored while generating tree string for directories. Also, setting `asciiTreeGenerator.directoryMaxDepth` can limit the depth of directory walking-through.

## Configuration

Each tree string character can be defined by its ASCII code representation (UTF character code, more generally). As such, the theorectical range for character codes is `0` to `65535` (two bytes). However, and important to note, is that not every character code is printable and/or may cause formatting issues.

The available parameters are:

| Property (Setting) Name            | Default Character Code | Default Character  | Description                  |
| ---------------------------------- | :--------------------: | :----------------: | ---------------------------- |
| `asciiTreeGenerator.rootElement`   |          `46`          |  <kbd>&#46;</kbd>  | For root elements            |
| `asciiTreeGenerator.parentElement` |         `9474`         | <kbd>&#9474;</kbd> | For vertical parent elements |
| `asciiTreeGenerator.childElement`  |         `9500`         | <kbd>&#9500;</kbd> | For child elements           |
| `asciiTreeGenerator.lastElement`   |         `9492`         | <kbd>&#9492;</kbd> | For last elements of paths   |
| `asciiTreeGenerator.dashElement`   |         `9472`         | <kbd>&#9472;</kbd> | For horizontal dash elements |
| `asciiTreeGenerator.blankElement`  |          `32`          |  <kbd>&#32;</kbd>  | For blank / space elements   |

### Sample Configurations

Commonly used configurations that you can manually enable by entering the values for each of the aforementioned property names above (perfom these changes inside a `settings.json` file).

|   Configuration   |           Root            |          Parent           |           Child           |           Last            |           Dash            |         Blank         |
| :---------------: | :-----------------------: | :-----------------------: | :-----------------------: | :-----------------------: | :-----------------------: | :-------------------: |
|      Default      |   `46` <kbd>&#46;</kbd>   | `9474` <kbd>&#9474;</kbd> | `9500` <kbd>&#9500;</kbd> | `9492` <kbd>&#9492;</kbd> | `9472` <kbd>&#9472;</kbd> | `32` <kbd>&#32;</kbd> |
|    Double Line    | `9559` <kbd>&#9559;</kbd> | `9553` <kbd>&#9553;</kbd> | `9568` <kbd>&#9568;</kbd> | `9562` <kbd>&#9562;</kbd> | `9552` <kbd>&#9552;</kbd> | `32` <kbd>&#32;</kbd> |
|      Classic      |   `43` <kbd>&#43;</kbd>   |  `124` <kbd>&#124;</kbd>  |  `124` <kbd>&#124;</kbd>  |   `43` <kbd>&#43;</kbd>   |   `45` <kbd>&#45;</kbd>   | `32` <kbd>&#32;</kbd> |
|  Classic Rounded  |   `43` <kbd>&#43;</kbd>   |  `124` <kbd>&#124;</kbd>  |  `124` <kbd>&#124;</kbd>  |   `96` <kbd>&#96;</kbd>   |   `45` <kbd>&#45;</kbd>   | `32` <kbd>&#32;</kbd> |
| Exclamation Marks |   `35` <kbd>&#35;</kbd>   |   `33` <kbd>&#33;</kbd>   |   `35` <kbd>&#35;</kbd>   |   `42` <kbd>&#42;</kbd>   |   `61` <kbd>&#61;</kbd>   | `32` <kbd>&#32;</kbd> |

## Issues and  Contribution

Please feel free to submit any issues or bugs you find with the extension. More generally, please reach out if you have any questions on how to use the extension.

Finally, contribution or ideas are humbly welcomed so please check us out on GitHub :) !
