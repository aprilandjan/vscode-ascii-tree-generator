import { IFileTreeItem, ICharset, IFormatOptions } from './interface';

const defaultCharset: ICharset = {
  root: String.fromCharCode(46), // '.',
  child: String.fromCharCode(9500), // '├',
  last: String.fromCharCode(9492), // '└',
  parent: String.fromCharCode(9474), // '|',
  dash: String.fromCharCode(9472), // '─',
  blank: String.fromCharCode(32), // ' ',
};

function createTreeString (start: string, fill: string, size: number = 3) {
  let result = '';
  for(let i = 0; i < size; i++) {
    if (i === 0) {
      result += start;
    } else {
      result += fill;
    }
  }
  return result + ' ';
}

/** format files */
export function format (items: IFileTreeItem[], options: IFormatOptions = {}) {
  const {
    eol = '\n',
    charset = defaultCharset,
  } = options;
  const lines = items.map(item => {
    const texts: string[] = [];
    texts.push(createTreeString(
      item.isLast ? charset.last : charset.child,
      charset.dash,
    ));
    let parent = item.parent;
    while (parent) {
      texts.unshift(createTreeString(
        parent.isLast ? charset.blank : charset.parent,
        charset.blank,
      ));
      parent = parent.parent;
    }
    return texts.join('') + item.name;
  });
  lines.unshift(charset.root);
  return lines.join(eol);
}