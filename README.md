# ascii tree generator

A VS Code plugin to generate ascii tree of directories or format selected text to tree strings.

## Usage

This plugin provides convenient way to generate ascii tree strings for directory in workspace explorer. Besides, you can select text in editor and format it to tree strings easily.

### Generate Tree Strings for Directory

Right-click on `Explorer` directories, click `Generate Tree Strings for Directory` menu:

![Generate Tree Strings for Directory](./images/directory.gif)

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

## Configuration

Not available yet...

## Issues & Contribution

Please feel free to submit issues if you have any questions. Contribution is also welcomed :)
