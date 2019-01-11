import { IFileTreeItem } from "./interface";

export function formatFileTreeItems (text: string = ''): IFileTreeItem[] {
  //  split selected text into separate lines
  //  empty lines are ignored
  const lines = text.split('\n').filter(line => line.trim() !== '');

  const items: IFileTreeItem[] = [];
  
  lines.reduce((list, line, index) => {
    //  iterate through each line
    //  line start with hash: /^#+/
    //  line start with indent /^[\t ]*/
    const matched = line.match(/(^#+)|(^[\t ]*)/);

    if (!matched) {
      return list;
    }
    let item: IFileTreeItem;
    let hash = matched[0];
    let depth = hash.length;
    let prev = list[index - 1];
    let name = line.slice(depth).trimLeft();
    if (depth === 0) {
      depth = 1;
    }
    if (prev) {
      if (depth > prev.depth) {
        //  child of prev item
        item = {
          name,
          isLast: false,
          //  depth must be added one by one
          depth: prev.depth + 1,
          parent: prev,
        };
      } else if (depth === prev.depth) {
        //  sibling of prev item
        item = {
          name,
          isLast: false,
          depth: prev.depth,
          parent: prev.parent,
        };
      } else {
        //  sibling of prev item parent/ancestor
        //  mark prev as last
        prev.isLast = true;
        let siblingIndex = index - 1;
        let sibling = list[siblingIndex];
        let lastMap: any = {};
        while (siblingIndex >= 0 && sibling.depth !== depth) {
          //  make sure the previous lines are properly set 'isLast'
          if (sibling.depth > depth && !lastMap[sibling.depth]) {
            sibling.isLast = true;
            lastMap[sibling.depth] = true;
          }
          siblingIndex --;
          sibling = list[siblingIndex];
        }
        item = {
          name,
          isLast: false,
          depth: sibling.depth,
          parent: sibling.parent,
        };
      }
    } else {
      //  no prev found. set as the first one, without parent.
      item = {
        name,
        isLast: false,
        depth: 1,
      };
    }

    list.push(item);
    return list;
  }, items);

  let last: IFileTreeItem | undefined = items[items.length - 1];
  while (last) {
    last.isLast = true;
    last = last.parent;
  }

  return items;
} 