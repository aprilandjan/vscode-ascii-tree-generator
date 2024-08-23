import * as rawGlob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { getCommentInFile } from '../utils';
import { IFileStat, IFileTreeItem, IListDirectoryConfig } from './interface';

const glob = promisify(rawGlob);
const readStat = promisify(fs.stat);

/**
 * get file stat
 * @param name
 * @param dir
 */
async function getFileStat(
  name: string,
  dir?: string,
  enableCommentInFile?: boolean
): Promise<IFileStat | null> {
  const absolutePath = path.join(dir || process.cwd(), name);
  let stat: fs.Stats;
  let comment: string | undefined;
  try {
    stat = await readStat(absolutePath);
  } catch (e) {
    return null;
  }
  if (enableCommentInFile) {
    comment = getCommentInFile(name, dir);
  }
  return {
    name,
    absolutePath,
    stat,
    comment,
    isDirectory: stat.isDirectory(),
    children: [],
  };
}

/**
 * sort these files like VS Code. directories first, and then non-directories
 * @param files
 */
function sortFilesLikeVSCode(files: IFileStat[]) {
  const directories = files.filter((item) => item.isDirectory);
  const nonDirectories = files.filter((item) => !item.isDirectory);
  return directories.concat(nonDirectories);
}

/**
 * list directory recursively
 *
 * @param dir
 * @param config
 */
export async function listDirectory(
  dir: string,
  config?: IListDirectoryConfig
): Promise<IFileStat[]> {
  const { ignore = [], sort = false, maxDepth = 1 } = config || {};
  if (maxDepth <= 0) {
    return [];
  }
  const fileNames = await glob('*', {
    cwd: dir,
    dot: true,
    nosort: !sort,
    ignore,
  });
  let files: IFileStat[] = (await Promise.all(
    fileNames.map((item) => getFileStat(item, dir, config?.enableCommentInFile))
  )) as IFileStat[];
  files = files.filter((item) => item !== null);
  //  sort
  if (sort) {
    files = sortFilesLikeVSCode(files);
  }
  const remainingDepth = maxDepth - 1;
  if (remainingDepth > 0) {
    for (const file of files) {
      if (file.isDirectory) {
        const subFiles = await listDirectory(file.absolutePath, {
          ...config,
          maxDepth: remainingDepth,
        });
        file.children = subFiles;
        //  add 'parent' mark
        subFiles.forEach((f) => {
          f.parent = file;
        });
      }
    }
  }
  return files;
}

export async function formatFileTreeItemsFromDirectory(
  dir: string,
  config?: IListDirectoryConfig
) {
  const files = await listDirectory(dir, config);

  const allList: IFileTreeItem[] = [];
  function traverseTree(list: IFileStat[], parent?: IFileTreeItem) {
    list.forEach((f, index) => {
      const item = {
        name: f.name,
        isLast: index === list.length - 1,
        comment: f.comment,
        depth: parent ? parent.depth + 1 : 0,
        parent,
      };
      allList.push(item);
      if (f.children!.length) {
        traverseTree(f.children!, item);
      }
    });
  }
  traverseTree(files);
  return allList;
}
