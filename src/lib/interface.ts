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

//  format tree string options
export interface IFormatOptions {
  charset?: ICharset;
  eol?: '\n' | '\r\n';
}