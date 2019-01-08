import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import { listDirectory, formatFileTreeItems } from '../../lib/directory';
import { format } from '../../lib/generator';

suite('lib/format functions', function () {
  this.timeout(120000);

  const rootDir: string = path.resolve(__dirname, '../../../fixtures/root');
  const rootText = fs.readFileSync(path.join(__dirname, '../../../fixtures/root.txt'), 'utf8');

  test('should correctly format tree from directory', async () => {
    const files = await listDirectory(rootDir, {
      maxDepth: Number.MAX_VALUE,
    });
    const fileItems = formatFileTreeItems(files);
    const treeText = format(fileItems).trim();
    assert(treeText.trim() === rootText.trim());
  });
});
