import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import { formatFileTreeItemsFromText } from '../../../lib/text';
import { IFileTreeItem } from '../../../lib/interface';

function findTreeItem(list: IFileTreeItem[], name: string) {
  return list.find((item) => item.name === name);
}

suite('lib/text functions', function () {
  this.timeout(120000);

  suite('parse from hash text', () => {
    let items: IFileTreeItem[];
    setup(function () {
      const text = fs.readFileSync(
        path.join(__dirname, '../../../fixtures/hash.txt'),
        'utf8'
      );
      items = formatFileTreeItemsFromText(text);
    });

    test('should correctly format no-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      assert(dist && dist.isLast === false && !dist.parent);
    });

    test('should correctly format no-parent last file', () => {
      const src = findTreeItem(items, 'src');
      assert(src && src.isLast === true && !src.parent);
    });

    test('should correctly format has-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      const assets = findTreeItem(items, 'assets');
      assert(assets && assets.isLast === false && assets.parent === dist);
    });

    test('should correctly format has-parent last file', () => {
      const logo = findTreeItem(items, 'logo.jpg');
      assert(logo && logo.isLast === true && logo.parent);
    });
  });

  suite('parse from indent text', () => {
    let items: IFileTreeItem[];
    setup(() => {
      const text = fs.readFileSync(
        path.join(__dirname, '../../../fixtures/indent.txt'),
        'utf8'
      );
      items = formatFileTreeItemsFromText(text);
    });

    test('should correctly format no-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      assert(dist && dist.isLast === false && !dist.parent);
    });

    test('should correctly format no-parent last file', () => {
      const src = findTreeItem(items, 'src');
      assert(src && src.isLast === true && !src.parent);
    });

    test('should correctly format has-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      const assets = findTreeItem(items, 'assets');
      assert(assets && assets.isLast === false && assets.parent === dist);
    });

    test('should correctly format has-parent last file', () => {
      const logo = findTreeItem(items, 'logo.jpg');
      assert(logo && logo.isLast === true && logo.parent);
    });
  });

  suite('parse from hash-indented text', () => {
    let items: IFileTreeItem[];
    setup(() => {
      const text = fs.readFileSync(
        path.join(__dirname, '../../../fixtures/hash-indented.txt'),
        'utf8'
      );
      items = formatFileTreeItemsFromText(text);
    });

    test('should correctly format item names', () => {
      const first = items[0];
      const env = findTreeItem(items, '.env');
      assert(first === env);
    });

    test('should correctly format no-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      assert(dist && dist.isLast === false && !dist.parent);
    });

    test('should correctly format no-parent last file', () => {
      const src = findTreeItem(items, 'src');
      assert(src && src.isLast === true && !src.parent);
    });

    test('should correctly format has-parent non-last file', () => {
      const dist = findTreeItem(items, 'dist');
      const assets = findTreeItem(items, 'assets');
      assert(assets && assets.isLast === false && assets.parent === dist);
    });

    test('should correctly format has-parent last file', () => {
      const logo = findTreeItem(items, 'logo.jpg');
      assert(logo && logo.isLast === true && logo.parent);
    });
  });

  suite('parse from hash-common-beginning text', () => {
    let items: IFileTreeItem[];
    setup(() => {
      const text = fs.readFileSync(
        path.join(__dirname, '../../../fixtures/hash-common-beginning.txt'),
        'utf8'
      );
      items = formatFileTreeItemsFromText(text);
    });

    test('should correctly format last file', () => {
      const first = items[0];
      const last = items[items.length - 1];
      assert(first.isLast === false);
      assert(last.isLast === true);
      assert(first.depth === last.depth);
    });
  });
});
