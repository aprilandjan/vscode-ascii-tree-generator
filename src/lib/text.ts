import { IFileTreeItem } from "./interface";

export function formatFileTreeItems (text: string = ''): IFileTreeItem[] {
  //  split selected text into separate lines
  const lines = text.split('\n');

  const items: IFileTreeItem[] = [];
  
  lines.reduce((list, line, index) => {
    console.log('loop: ', index, line, list);

    const matched = line.match(/^#+/);
    let item: IFileTreeItem;
    if (matched) {
      let hash = matched[0];
      let depth = hash.length;
      let prev = list[index - 1];
      let name = line.slice(depth).trimLeft();
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
          while (sibling.depth !== depth) {
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

    } else {
      //  not valid line
      item = {
        name: line.trimLeft(),
        isLast: false,
        depth: 0,
      };
    }

    list.push(item);
    return list;
  }, items);

  if (items.length) {
    items[items.length - 1].isLast = true;
  }

  return items;
} 