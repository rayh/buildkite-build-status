var specHelper = require("../spec-helper");
var app = require("../../app/app");


// describe("applyWhitelist", function () {
//   it("should filter non-whitelisted specs", function () {

//     var doc = specHelper.jsdom(xml);
//     var projects = doc.getElementsByTagName('Project');

//     var whitelist = [ 'hotels-master', 'flightbookings-master' ];
//     var whiteListed = applyWhitelist(projects, whitelist);

//     console.log(applyWhitelist(projects, whitelist)[0].getAttribute('name'));

//     expect( whiteListed.length ).toBe( 2 );
//     expect( whiteListed[0].getAttribute('name') ).toBe( 'Flightbookings (master)' );
//     expect( whiteListed[1].getAttribute('name') ).toBe( 'Hotels (master)' );

//   });
// });

describe("applyWhitelist", function () {
  it("should filter non-whitelisted specs", function () {

    var doc = specHelper.jsdom(xml);
    var projects = doc.getElementsByTagName('Project');

    var whitelist = [ 'hotels', 'flightbookings' ];
    var whiteListed = applyWhitelist(projects, whitelist);

    expect( whiteListed.length ).toBe( 2 );
    expect( whiteListed[0].getAttribute('name') ).toBe( 'Flightbookings (master)' );
    expect( whiteListed[1].getAttribute('name') ).toBe( 'Hotels (master)' );

  });
});