var fs = require('fs');

require.extensions['.xml'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports.jsdom = require("jsdom-nogyp").jsdom;
module.exports.xml = require("./fixtures/buildbox_cctray.xml");
module.exports.settings = require('../app/config.json');
