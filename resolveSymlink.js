
var path = require('path');
var fs = require('fs');

module.exports = function resolveSymlink(symlink) {
  var visited = [];

  var linkedPath = symlink;
  while (fs.lstatSync(linkedPath).isSymbolicLink()) {
    var index = visited.indexOf(linkedPath);
    if (index !== -1) {
      throw Error(
        'Infinite symlink recursion detected:\n  ' +
          visited.slice(index).join('\n  ')
      );
    }

    visited.push(linkedPath);
    linkedPath = path.resolve(
      path.dirname(linkedPath),
      fs.readlinkSync(linkedPath)
    );
    if (!fs.existsSync(linkedPath)) {
      throw Error(
        'Symlink resolves into non-existent path:\n  ' +
          linkedPath + '\n\n  ' +
          visited.slice(index).join('\n  ')
      );
    }
  }

  return linkedPath;
};
