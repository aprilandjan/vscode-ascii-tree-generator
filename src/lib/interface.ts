import { Stats } from "fs";

export interface IListDirectoryConfig {
  ignore?: string[];
  sort?: boolean;
  maxDepth?: number;
}

export interface IFileStat {
  name: string;
  absolutePath: string;
  stat: Stats;
  isDirectory: boolean;
  children: IFileStat[];
  parent?: IFileStat;
}

export interface IFileTreeItem {
  name: string;
  isLast: boolean;
  depth: number;
  // left space width
  left?: number;
  parent?: IFileTreeItem;
}

//  the charset interface
export interface ICharset {
  root: string;
  child: string;
  last: string;
  parent: string;
  dash: string;
  blank: string;
}

//  the VS code config interface
export interface IVsCodeConfig {
  ignore: string[];
  rootCharCode: number | undefined;
  childCharCode: number | undefined;
  lastCharCode: number | undefined;
  parentCharCode: number | undefined;
  dashCharCode: number | undefined;
  blankCharCode: number | undefined;
}

//  format tree string options
export interface IFormatOptions {
  /** fill left with same minimal space */
  fillLeft?: boolean;
  /** root text added to the formatted tree strings */
  root?: string;
  /** tree charset settings */
  charset?: ICharset;
  /** end-of-line filling character */
  eol?: '\n' | '\r\n';
}