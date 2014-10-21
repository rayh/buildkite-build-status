(function() {

  var settings = BuildboxMonitor.settings, utilities = BuildboxMonitor.utilities, rendered = [];
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
    var whitelisted = settings.whitelist;
    projects = applyWhitelist(projects, whitelisted);
    var builds = document.getElementsByClassName('builds');
    if(rendered.length == 0) { buildRows(builds, projects); }

    for(var i = 0; i < projects.length; i++) {
      var currentRow = document.getElementById("row" + Math.ceil((i+1) / settings.buildsPerRow));
      var name = utilities.dasherize(projects[i].getAttribute('name'));
      var activity = projects[i].getAttribute('activity').toLowerCase();
      var lastStatus = getLastStatus(projects[i]);
      var currentStatus = getCurrentStatus(lastStatus, activity);
      if(rendered.indexOf(name) > -1) {
        updateStatus(name, lastStatus, activity, currentStatus);
      } else {
        renderRow(currentRow, { name: name, lastStatus: lastStatus, currentStatus: currentStatus, activity: activity });
        rendered.push(name);
      }
    }
  }

  var applyWhitelist = function(projects, whitelistedProjects) {
    newProjects = []
    for(var i = 0; i < projects.length; i++) {
      if( whitelistedProjects.indexOf(projects[i].getAttribute('name')) >= 0 ) {
        newProjects.push( projects[i] );
      }
    }
    return newProjects;
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

  var getLastStatus = function(project) {
    if (!project.getAttribute('lastBuildStatus')) {
      return 'inactive';
    }
    return project.getAttribute('lastBuildStatus').toLowerCase();
  }

  var updateStatus = function(buildName, lastStatus, activity, currentStatus) {
    var build = document.getElementById(buildName);
    build.className = 'bubble bubble--' + lastStatus + ' bubble--' + activity ;
    build.innerHTML = utilities.humanize(currentStatus);
  }

  var renderRow = function(row, dataObj){
    html = row.innerHTML;
    html += tmpl("build_template", dataObj);
    row.innerHTML = html;
  }

  fetchBuildStatus(function(error, xml) {
    process(xml);
  });

  setInterval(function() {
    console.log('Polling...');
    fetchBuildStatus(function(error, xml) {
      process(xml);
    });
  }, settings.pollInterval);

})();