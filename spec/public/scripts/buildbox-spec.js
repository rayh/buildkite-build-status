var specHelper = require("../../spec-helper");
var tmpl = require("../../../public/scripts/micro_templates");
var buildKite = require("../../../public/scripts/buildkite").buildKite;

var buildTemplate;

beforeEach(function() {
  document = jsdom(page);
});

afterEach(function() {
  document = null;
});

describe("process", function () {

  it("renders the document structure properly", function () {

    buildKite.process(payload);

    var builds = document.getElementsByClassName('builds')[0];
    var rows = builds.getElementsByClassName('row');
    var projects = rows[0].getElementsByTagName('section');

    expect( rows.length ).toEqual( 1 );
    expect( projects.length ).toEqual( 2 );

    expect( projects[0].className ).toBe( 'build build--inactive' );
    expect( projects[1].className ).toBe( 'build build--failure' );

  });


});