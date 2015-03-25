var fs = require('fs');

require.extensions['.xml'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports.jsdom = require("jsdom-nogyp").jsdom;
module.exports.xml = require("./fixtures/buildkite_cctray.xml");
module.exports.page = require("../public/index.html");
module.exports.settings = require('../app/config.sample.json');

module.exports.payload = [
  { name: 'Flightbookings (master)', identifier: 'flightbookings-master', dashedStatus: 'inactive', priorStatus: 'Inactive', dashedPriorStatus: 'inactive', status: 'Inactive', timeStamp: 'N/A', buildNumber: '#1337' },
  { name: 'Hotels (master)', identifier: 'hotels-master', dashedStatus: 'failure', priorStatus: 'Failure', dashedPriorStatus: 'failure',  status: 'Failure', timeStamp: 'N/A', buildNumber: '#255' }
]