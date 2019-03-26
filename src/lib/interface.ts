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
  child: string;
  last: string;
  parent: string;
  dash: string;
  blank: string;
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