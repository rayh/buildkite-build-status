var specHelper = require("../spec-helper");
var app = require("../../app/app");

beforeEach(function() {
  settings.whitelist = [ 'hotels', 'flightbookings' ];
});

describe("processXMLResponse", function () {
  it("generates the correct payload", function () {

    var statuses = processXMLResponse(xml);
    var payload = [
      { name: 'Flightbookings (master)', identifier: 'flightbookings-master', status: 'inactive', friendlyStatus: 'Inactive', timeStamp: 'N/A', buildNumber: '#1337' },
      { name: 'Hotels (master)', identifier: 'hotels-master', status: 'failure', friendlyStatus: 'Failure', timeStamp: '4 hours ago', buildNumber: '#255' }
    ]

    expect( statuses ).toEqual( payload );

  });
});

describe("applyWhitelist", function () {
  it("should filter non-whitelisted specs", function () {

    var doc = specHelper.jsdom(xml);
    var projects = doc.getElementsByTagName('Project');

    var whiteListed = applyWhitelist(projects, settings.whitelist);

    expect( whiteListed.length ).toBe( 2 );
    expect( whiteListed[0].getAttribute('name') ).toBe( 'Flightbookings (master)' );
    expect( whiteListed[1].getAttribute('name') ).toBe( 'Hotels (master)' );

  });
});