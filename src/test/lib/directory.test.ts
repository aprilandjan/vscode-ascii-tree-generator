import * as assert from 'assert';
import * as path from 'path';

import { listDirectory, formatFileTreeItemsFromDirectory } from '../../lib/directory';
import { IFileStat } from '../../lib/interface';

function findFileByName(files: IFileStat[] = [], name: string) {
  let result: IFileStat | undefined = undefined;
  files.forEach(file => {
    if (file.name === name) {
      result = file;
    } else if (!result) {  
      result = findFileByName(file.children, name);
    }
  });
  return result;
}

suite("lib/directory functions", function () {
  this.timeout(120000);

  const rootDir: string = path.resolve(__dirname, '../../../fixtures/root');

  test("should correctly list directory", async () => {
    const files = await listDirectory(rootDir);
    assert(files.length === 5);
    const hasChildren = files.filter(file => file.children!.length);
    assert(hasChildren.length === 0);
  });

  test('should correctly list directory when ignore', async () => {
    const ignore = [
      'node_modules',
      '.*',
    ];
    const files = await listDirectory(rootDir, {
      ignore,
    });
    assert(files.length === 3);
    assert(findFileByName(files, 'node_modules') === undefined);
    assert(findFileByName(files, '.env') === undefined);
  });

  test('should correctly list directory when sort', async () => {
    const files = await listDirectory(rootDir, {
      sort: true,
    });
    const fileNames = files.map(item => item.name);
    assert.deepEqual(fileNames, [
      'dist',
      'node_modules',
      'src',
      '.env',
      'README.md',
    ]);
  });

  test('should correctly list directories when recursively into depth 3', async () => {
    const files = await listDirectory(rootDir, {
      maxDepth: 3,
    });
    assert(findFileByName(files, 'img'));
    assert(findFileByName(files, 'logo.png') === undefined);
  });

  test('should correctly format file tree items', async () => {
    const fileItems = await formatFileTreeItemsFromDirectory(rootDir, {
      maxDepth: Number.MAX_VALUE,
      sort: true,
    });
    assert(fileItems.length === 16);
    const logo = fileItems.find(item => item.name === 'logo.jpg');
    assert(logo!.depth === 3);
    assert(logo!.parent!.depth === 2);
    assert(logo!.parent!.name === 'img');
  });
});