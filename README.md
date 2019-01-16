# ascii tree generator

A VS Code plugin to generate/format ascii tree for files and directories.

## Working In Progress

This plugin is currently working in progress.

## Usage

### Workspace

### TextEditor

## Configuration

- 自动排序。开启之后会手动排序一次（和 VSCode 的文件排序规则相同）。默认否，和原输入行的顺序保持一致；
- 文件忽略列表。当生成当前项目目录时，默认忽略以下文件(参考 https://docs.npmjs.com/misc/developers)
  - `.git`
  - `node_modules`
  - `.svn`
  - `.DS_Store`
- 最大层级深度。当生成当前项目目录时，从根目录开始，默认的文件层级深度。默认为3层。设为0不限制；
- ascii 字符样式。提供自定义的可能。

## Supported text format

### text with `indent`

```
public
dist
  index.d.ts
  index.js
src
  index.ts
```

### text with `hash(`#`)` symbol

```
# public
# dist
## index.d.ts
## index.js
# src
## index.ts
```

### VS Code Reference

- [api reference](https://code.visualstudio.com/api/references/vscode-api#Uri)
- [`when` clause context](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)
- [`menu` group types](https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups)

### Other Reference

- <https://en.wikipedia.org/wiki/Tree_(command)>
- <https://www.geeksforgeeks.org/tree-command-unixlinux/>
- <https://stackoverflow.com/questions/19699059/representing-directory-file-structure-in-markdown-syntax>
- <https://code.visualstudio.com/api/get-started/wrapping-up>
- <https://github.com/mbr/asciitree>
- <https://www.npmjs.com/package/ascii-tree>
- <https://atom.io/packages/ascii-tree>
- <https://unix.stackexchange.com/questions/127063/tree-command-output-with-pure-7-bit-ascii-output>