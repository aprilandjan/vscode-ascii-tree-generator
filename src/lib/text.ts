import { IFileTreeItem } from './interface';

/** get line array. these lines are trimLeft with their common beginning substring. */
function getLines(text = '') {
  //  split selected text into separate lines
  //  empty lines are ignored
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  if (lines.length <= 1) {
    return lines;
  }

  const first = lines[0];
  let commonSize = 0;
  for (let i = 1; i < first.length; i++) {
    if (first[i - 1] === ' ') {
      break;
    }
    const substr = first.substr(0, i);
    if (lines.every((line) => line.startsWith(substr))) {
      commonSize = i;
    } else {
      break;
    }
  }
  if (commonSize > 0) {
    return lines.map((line) => line.substr(commonSize - 1).trimLeft());
  }
  return lines;
}

export function formatFileTreeItemsFromText(text = ''): IFileTreeItem[] {
  const lines = getLines(text);

  //  find common hash
  const items: IFileTreeItem[] = [];

  lines.reduce((list, line, index) => {
    //  iterate through each line
    //  line start with hash: /^#+/
    //  line start with indent: /^[\t ]*/
    //  line start with indent + hash: /^[\t ]*#*/
    const matched = line.match(/^[\t ]*#*/);

    if (!matched) {
      return list;
    }
    let item: IFileTreeItem;
    //  symbol
    let symbol = matched[0];
    const name = line.slice(symbol.length).trim();
    const hash = symbol.match(/#+/);
    let left = 0;
    //  if contains hash, read hash as its depth symbol
    if (hash) {
      left = symbol.length - hash[0].length;
      symbol = hash[0];
    }
    let depth = symbol.length;
    const prev = list[index - 1];
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
        const lastMap: any = {};
        while (siblingIndex >= 0 && sibling.depth !== depth) {
          //  make sure the previous lines are properly set 'isLast'
          if (sibling.depth > depth && !lastMap[sibling.depth]) {
            sibling.isLast = true;
            lastMap[sibling.depth] = true;
          }
          siblingIndex--;
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

    item.left = left;
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
