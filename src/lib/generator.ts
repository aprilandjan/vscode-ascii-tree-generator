import { EOL } from 'os';
import { IFileTreeItem, IFormatOptions } from './interface';
import { defaultCharset } from '../utils';

function createTreeString(start: string, fill: string, size = 3) {
  let result = '';
  for (let i = 0; i < size; i++) {
    if (i === 0) {
      result += start;
    } else {
      result += fill;
    }
  }
  return result + ' ';
}

/** generate tree string */
export function generate(items: IFileTreeItem[], options: IFormatOptions = {}) {
  const { eol = EOL, charset = defaultCharset, fillLeft = true } = options;
  let leftSpace = '';
  if (fillLeft) {
    const minLeft = items.length
      ? Math.min(...items.map((item) => item.left || 0))
      : 0;
    leftSpace = Array(minLeft).fill(' ').join('');
  }
  const lines = items.map((item) => {
    const texts: string[] = [];
    texts.push(
      createTreeString(item.isLast ? charset.last : charset.child, charset.dash)
    );
    let parent = item.parent;
    while (parent) {
      texts.unshift(
        createTreeString(
          parent.isLast ? charset.blank : charset.parent,
          charset.blank
        )
      );
      parent = parent.parent;
    }
    return leftSpace + texts.join('') + item.name;
  });
  if (charset.root !== '') {
    lines.unshift(leftSpace + charset.root);
  }
  return lines.join(eol);
}
