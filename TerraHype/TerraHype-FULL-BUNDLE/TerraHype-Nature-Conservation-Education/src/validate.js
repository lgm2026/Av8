// Strict parser ruleset for the single-file app.
// 1) Babel parse with preset-react must succeed.
// 2) No optional chaining (?.), no nullish coalescing (??).
var fs = require("fs");
var babel = require("@babel/core");

var file = process.argv[2];
var src = fs.readFileSync(file, "utf8");
var errors = [];

try {
  babel.transformSync(src, { presets: [["@babel/preset-react"]], filename: file, babelrc: false, configFile: false });
} catch (e) {
  errors.push("BABEL: " + e.message);
}

var lines = src.split("\n");
lines.forEach(function (raw, i) {
  var ln = i + 1;
  var line = raw;
  var c = line.indexOf("//");
  if (c > -1) line = line.slice(0, c);
  if (line.indexOf("?.") > -1) errors.push("OPTIONAL_CHAINING line " + ln + ": " + raw.trim());
  if (line.indexOf("??") > -1) errors.push("NULLISH_COALESCING line " + ln + ": " + raw.trim());
});

if (errors.length) {
  console.log("FAIL (" + errors.length + " issue(s)):");
  errors.slice(0, 40).forEach(function (e) { console.log("  - " + e); });
  process.exit(1);
} else {
  console.log("PASS: parses clean, no forbidden tokens. Lines: " + lines.length);
}
