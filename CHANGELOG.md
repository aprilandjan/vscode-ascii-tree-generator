# Change Log
All notable changes to the "ascii-tree-generator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [2.0.0] - 2024-12-22

Finally found my vscode market account😭. This version mainly improve configuration names, docs and coding styles, with some breaking changes([!15](https://github.com/aprilandjan/vscode-ascii-tree-generator/pull/15) by [@mahyarmirrashed](https://github.com/mahyarmirrashed)).

### Changed

- Reformatted files for easier readability (`Prettier` extension)
- Formalized [README.md](README.md) contents
- Changed property names (should not have spaces in them and was not descriptive to current extension)

### Fixed

- Some bug in VSCode `bin` installation when using yarn
  - To fix, change stable releases link from `https://vscode-update.azurewebsites.net/api/releases/stable` to `https://update.code.visualstudio.com/api/releases/stable`

## [1.2.4] - 2020-09-11

- Remove the introduction (temporarily) for `indent` character usage in [README.md](README.md) since it is buggy (see [#13](https://github.com/aprilandjan/vscode-ascii-tree-generator/issues/13)).

## [1.2.3] - 2020-04-29

### Fixed

- Fix `Revert Tree String to Text` regex on more depth tree strings([@Rolaka](https://github.com/Rolaka))

## [1.2.2] - 2020-03-07

### Fixed

- Fix wording and menu command group([@tjx666](https://github.com/tjx666)).

## [1.2.1] - 2019-11-08

### Fixed

- Fix problems while reading user charset configurations.

## [1.2.0] - 2019-11-08

### Added

- Added configuration for character codes([@rabanti-github](https://github.com/rabanti-github)).

## [1.1.2] - 2019-10-09

### Fixed

- Fix exceptions when try to generate from an empty directory folder.

## [1.1.1] - 2019-03-26

### Fixed

- Fix errors when formatting text lines with same multiple hash beginnings.

## [1.1.0] - 2019-03-19

### Feature

- Add `Revert Tree String to Text` command in `Command Palette`.

## [1.0.1] - 2019-01-23

### Fixed

- Support formatting lines started with indent+hash pattern.
- Fix errors when `fs.stat`. If failed, the file will be ignored in result.

## [1.0.0] - 2019-01-23

- Initial release