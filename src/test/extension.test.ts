import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { revertTreeString } from '../utils';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function () {
  this.timeout(120000);

  // Defines a Mocha unit test
  // test("Something 1", function() {
  //     assert.equal(-1, [1, 2, 3].indexOf(5));
  //     assert.equal(-1, [1, 2, 3].indexOf(0));
  // });
  test('revert tree string to text', function () {
    const rootText = fs.readFileSync(
      path.join(__dirname, '../../fixtures/root.txt'),
      'utf8'
    );
    const rootReverted = fs.readFileSync(
      path.join(__dirname, '../../fixtures/root-reverted.txt'),
      'utf8'
    );
    const reverted = revertTreeString(rootText);
    const a = reverted.trim().split('\n');
    const b = rootReverted.trim().split('\n');
    a.forEach((line, idx) => {
      if (a[idx] !== b[idx]) {
        console.log(a[idx], b[idx]);
      }
    });
    assert(reverted.trim() === rootReverted.trim());
  });

  // https://github.com/aprilandjan/ascii-tree-generator/pull/11
  test('revert more-depth tree string to text', function () {
    const origin = fs.readFileSync(
      path.join(__dirname, '../../fixtures/more-depth-reverted.txt'),
      'utf8'
    );
    const treeString = fs.readFileSync(
      path.join(__dirname, '../../fixtures/more-depth.txt'),
      'utf8'
    );
    const reverted = revertTreeString(treeString);
    assert(origin.trim() === reverted.trim());
  });
});
