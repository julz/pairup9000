var __karmaWebpackManifest__ = [];

var context = require.context('./src', true, /-test\.js$/);
context.keys().forEach(context);

function inManifest(path) {
  return __karmaWebpackManifest__.indexOf(path) >= 0;
}

var runnable = context.keys().filter(inManifest);

// Run all tests if we didn't find any changes
if (!runnable.length) {
  runnable = context.keys();
}

runnable.forEach(context);
