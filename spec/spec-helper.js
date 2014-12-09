var fs = require('fs');

require.extensions['.xml'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports.jsdom = require("jsdom-nogyp").jsdom;
module.exports.xml = require("./fixtures/buildbox_cctray.xml");
module.exports.page = require("../public/index.html");
module.exports.settings = require('../app/config.json');

module.exports.payload = [
  { name: 'Flightbookings (master)', identifier: 'flightbookings-master', status: 'inactive', lastStatus: 'inactive', friendlyStatus: 'Inactive', timeStamp: 'N/A', buildNumber: '#1337' },
  { name: 'Hotels (master)', identifier: 'hotels-master', status: 'failure', lastStatus: 'failure', friendlyStatus: 'Failure', timeStamp: 'N/A', buildNumber: '#255' }
]