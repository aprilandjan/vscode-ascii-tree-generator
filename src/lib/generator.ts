import { EOL } from 'os';
import { IFileTreeItem, IFormatOptions } from './interface';
import { defaultCharset, getTreeStringItemCharacterLength } from '../utils';
const DEFAULT_COMMENT_PRE_SPACE = '    ';
const DEFAULT_COMMENT_PRE_TEXT = '// ';
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

function getItemCommentText(maxRight: number, item: IFileTreeItem) {
  if (!item.comment) return '';
  const itemRight = getTreeStringItemCharacterLength(item.depth, item.name);
  const itemRightSpace = maxRight - itemRight;
  return Array(itemRightSpace).fill(' ').join('') + DEFAULT_COMMENT_PRE_SPACE + DEFAULT_COMMENT_PRE_TEXT + item.comment;
}

/** generate tree string */
export function generate(items: IFileTreeItem[], options: IFormatOptions = {}) {
  const {
    eol = EOL,
    charset = defaultCharset,
    fillLeft = true,
  } = options;
  let leftSpace = '';
  if (fillLeft) {
    const minLeft = items.length
      ? Math.min(...items.map((item) => item.left || 0))
      : 0;
    leftSpace = Array(minLeft).fill(' ').join('');
  }
  const maxRight = items.length
    ? Math.max(...items.map((item) => getTreeStringItemCharacterLength(item.depth, item.name) || 0))
    : 0;
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
    return leftSpace + texts.join('') + item.name + getItemCommentText(maxRight, item);
  });
  if (charset.root !== '') {
    lines.unshift(leftSpace + charset.root);
  }
  return lines.join(eol);
}
