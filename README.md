# ascii tree generator

A VSCode plugin to generate/format ascii tree for files and directories.

## Working In Progress

This plugin is currently working in progress.

## 使用方式

- Cmd+P, 通过命令生成当前目录 ASCII 树 command: generate ASCII tree
- 选中一段文本，右键菜单中添加功能按钮 Format as ASCII tree

## 配置项

- 自动排序。开启之后会手动排序一次（和 VSCode 的文件排序规则相同）。默认否，和原输入行的顺序保持一致；
- 文件忽略列表。当生成当前项目目录时，默认忽略以下文件(参考 https://docs.npmjs.com/misc/developers)
  - `.git`
  - `node_modules`
  - `.svn`
  - `.DS_Store`
- 最大层级深度。当生成当前项目目录时，从根目录开始，默认的文件层级深度。默认为3层。设为0不限制；
- ascii 字符样式。提供自定义的可能。

## 支持的写法

解析时要注意：

1. windows/mac 换行符不一样。windows 需要设置 `\r\n` 为换行符，mac 需要设置为 `\n` 为换行符(或者查看当前文件的换行符标识);
2. 不合理的深度的行（深度非递增的），自动调整深度为上层有效深度。

### indent 写法

使用 root 来标识根目录。其他的行都判断当前行有几个 indent, 用来判定层深。

```
root
  public
    ...
  lib
    index.min.js
  dist
    index.d.ts
    index.js
  src
    index.ts
```

### 符号 `#` 写法

这种写法只查找每一行以几个 `#` 开头，用以判断层级

```
# public
# dist
## index.d.ts
## index.js
# src
## index.ts
```

### 参考

- https://en.wikipedia.org/wiki/Tree_(command)
- <https://stackoverflow.com/questions/19699059/representing-directory-file-structure-in-markdown-syntax>
- <https://code.visualstudio.com/api/get-started/wrapping-up>
- <https://github.com/mbr/asciitree>
- <https://www.npmjs.com/package/ascii-tree>
- <https://atom.io/packages/ascii-tree>