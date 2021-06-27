import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import { formatFileTreeItemsFromDirectory } from '../../../lib/directory';
import { formatFileTreeItemsFromText } from '../../../lib/text';
import { generate } from '../../../lib/generator';
import { setTestMode } from '../../../utils';

suite('lib/generator functions', function () {
  this.timeout(120000);
  // Enable test mode to override user defined chars with defaults
  setTestMode();
  const rootDir: string = path.resolve(__dirname, '../../../../fixtures/root');
  const rootText = fs.readFileSync(
    path.join(__dirname, '../../../../fixtures/root.txt'),
    'utf8'
  );
  const rootSorted = fs.readFileSync(
    path.join(__dirname, '../../../../fixtures/root-sorted.txt'),
    'utf8'
  );
  const rootFillLeft = fs.readFileSync(
    path.join(__dirname, '../../../../fixtures/root-fill-left.txt'),
    'utf8'
  );

  test('should correctly generate tree from directory', async () => {
    const items = await formatFileTreeItemsFromDirectory(rootDir, {
      maxDepth: Number.MAX_VALUE,
      sort: true,
    });
    const treeText = generate(items);
    assert(treeText.trim() === rootSorted.trim());
  });

  test('should correctly generate tree from hash text', () => {
    const text = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/hash.txt'),
      'utf8'
    );
    const items = formatFileTreeItemsFromText(text);
    const treeText = generate(items);
    assert(treeText.trim() === rootText.trim());
  });

  test('should correctly generate tree from indent text', () => {
    const text = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/indent.txt'),
      'utf8'
    );
    const items = formatFileTreeItemsFromText(text);
    const treeText = generate(items);
    assert(treeText.trim() === rootText.trim());
  });

  test('should correctly generate tree from hash-indented text if fill-left', () => {
    const text = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/hash-indented.txt'),
      'utf8'
    );
    const items = formatFileTreeItemsFromText(text);
    const treeText = generate(items);
    assert(treeText === rootFillLeft);
  });

  test('should correctly generate tree from hash-indented text if not fill-left', () => {
    const text = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/hash-indented.txt'),
      'utf8'
    );
    const items = formatFileTreeItemsFromText(text);
    const treeText = generate(items, {
      fillLeft: false,
    });
    assert(treeText === rootText);
  });
});
