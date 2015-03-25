var specHelper = require("../spec-helper");
var app = require("../../app/app");

beforeEach(function() {
  settings.whitelist = [ 'hotels', 'flightbookings' ];
});

describe("processXMLResponse", function () {
  it("generates the correct payload", function () {

    var statuses = processXMLResponse(xml);
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