(function() {

  var settings = BuildboxMonitor.settings;
  var utilities = BuildboxMonitor.utilities;
  var rendered = [];
  var url = 'https://cc.buildbox.io/' + settings.project + '.xml?api_key=' + settings.apiKey;

  var fetchBuildStatus = function(callback) {
    var request = new XMLHttpRequest();
    request.onload = function(result) {
      callback(null, result.target.responseXML);
    }
    request.open("get", url);
    request.send();
  }

  var process = function(xml) {
    var projects = xml.getElementsByTagName('Project');
    var builds = document.getElementsByClassName('builds');
    buildRows(builds, projects);

    for(var i = 0; i < projects.length; i++) {
      var currentRow = document.getElementById("row" + Math.ceil((i+1) / settings.buildsPerRow));
      var name = projects[i].getAttribute('name').replace(/\s/g, '-');
      var activity = projects[i].getAttribute('activity').toLowerCase();
      var lastStatus = (projects[i].getAttribute('lastBuildStatus'))
        ? projects[i].getAttribute('lastBuildStatus').toLowerCase()
        : 'inactive';
      var currentStatus = getCurrentStatus(lastStatus, activity);

      if(rendered.indexOf(name) > -1) {
        var build = document.getElementById(name);
        build.className = 'bubble ' + lastStatus + ' ' + activity ;
        build.innerHTML = utilities.humanize(lastStatus);
      } else {
        html = currentRow.innerHTML;
        html += tmpl("build_template", { name: name, lastStatus: lastStatus, currentStatus: currentStatus, activity: activity });
        currentRow.innerHTML = html;
        rendered.push(name);
      }
    }
  }

  var buildRows = function(builds, projects) {
    var rows = Math.ceil(projects.length / settings.buildsPerRow);
    var rowHtml = '';

    for(var i = 0; i < rows; i++) { rowHtml += tmpl("row_template", { rowNumber: (i+1) }); }
    builds[0].innerHTML = rowHtml;
  }

  var getCurrentStatus = function(lastStatus, activity) {
    if(activity == "building") {
      return utilities.humanize(activity);
    }
    return utilities.humanize(lastStatus);
  }

  fetchBuildStatus(function(error, xml) {
    process(xml);
  });

  // setInterval(function() {
  //   fetchBuildStatus(function(error, xml) {
  //     process(xml);
  //   });
  // }, Settings.pollInterval);


})();
