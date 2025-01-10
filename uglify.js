if (typeof atob === 'undefined') {
  var atob = function (input) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = String(input).replace(/=+$/, '');
    let output = '';

    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }

    for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++));) {
      buffer = chars.indexOf(buffer);
      if (~buffer) {
        bs = bc % 4 ? bs * 64 + buffer : buffer;
        bc++;
        if (bc % 4) {
          output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
        }
      }
    }

    return output;
  };
}

if (typeof btoa === 'undefined') {
  var btoa = function (input) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = String(input);
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))) {
      charCode = str.charCodeAt(i += 3 / 4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = (block << 8) | charCode;
    }

    return output;
  };
}

// Load UglifyJS components
load('UglifyJS/lib/utils.js');
load('UglifyJS/lib/ast.js');
load('UglifyJS/lib/parse.js');
load('UglifyJS/lib/transform.js');
load('UglifyJS/lib/scope.js');
load('UglifyJS/lib/output.js');
load('UglifyJS/lib/compress.js');
load('UglifyJS/lib/propmangle.js');
load('UglifyJS/lib/minify.js');

// Read the file passed as the first argument
if (typeof scriptArgs === 'undefined' || scriptArgs.length === 0) {
  throw new Error("Please provide a file path as the first argument.");
}

const filePath = scriptArgs[0];
let fileContent;

try {
  fileContent = read(filePath);
} catch (e) {
  throw new Error("Error reading file: " + e.message);
}

// Minify the file content
var result = minify(fileContent);

if (result.error) {
  throw new Error("Error during minification: " + result.error);
}

// Print the minified code
print(result.code);

