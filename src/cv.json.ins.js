fs = require("fs");

fs.createReadStream( __dirname + '/cv.json').pipe(fs.createWriteStream('cv.json'));
fs.createReadStream( __dirname + '/profile.jpg').pipe(fs.createWriteStream('profile.jpg'));
fs.createReadStream( __dirname + '/index_node.html').pipe(fs.createWriteStream('index.html'));


var ncp = require('ncp').ncp;

ncp.limit = 16;

ncp(__dirname + '/info', 'info/', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Info folder copied');
});
