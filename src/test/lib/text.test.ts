import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import { formatFileTreeItems } from '../../lib/text';
import { format } from '../../lib/generator';

suite('lib/text functions', function () {
  this.timeout(120000);
  
  const input = fs.readFileSync(path.join(__dirname, '../../../fixtures/hash.txt'), 'utf8');

  test('should correctly format file tree items from text', async () => {
    // Todo: improve test case
    const result = formatFileTreeItems(input);
    assert(result);

    const output = format(result);
    assert(output);
  });
});
