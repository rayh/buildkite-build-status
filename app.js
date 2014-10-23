var request = require('request');
var express = require('express');

var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var jsdom   = require("jsdom-nogyp").jsdom;
var utils   = require("./utils");


// var initialUrl = 'http://developer:feeling%20tomorrow%20moon@localhost:5000/developer/bookings/for-month?limit=500'
// var pollUrl = 'https://developer:feeling%20tomorrow%20moon@hotels.hooroo.com/developer/bookings/latest'

var settings = require('./config.json');

app.use(express.static(__dirname + '/public'));

pollUrl = 'https://cc.buildbox.io/' + settings.project + '.xml?api_key=' + settings.apiKey + '&branch=master';

processXMLResponse = function(xml) {
  var doc = jsdom(xml);
  var projects = doc.getElementsByTagName('Project');
  var whitelisted = settings.whitelist;
  projects = applyWhitelist(projects, whitelisted);

  statuses = [];
  for(var i = 0; i < projects.length; i++) {
    project = projects[i];
    projectName         = project.getAttribute('name');
    projectActivity     = project.getAttribute('activity');
    projectLastStatus   = getLastStatus(project);

    status = {
      name:                 utils.dasherize(projectName),
      activity:             projectActivity.toLowerCase(),
      lastStatus:           projectLastStatus,
      currentStatus:        getCurrentStatus(projectLastStatus, projectActivity),
      lastBuildTimeStamp:   utils.friendlyDate(project.getAttribute('lastBuildTime')),
      lastBuildLabel:       getBuildLabel(project)
    }
    statuses.push(status);
  }
  console.log(statuses);

}

applyWhitelist = function(projects, whitelistedProjects) {
  newProjects = []
  for(var i = 0; i < projects.length; i++) {
    if( whitelistedProjects.indexOf( utils.dasherize(projects[i].getAttribute('name')) ) >= 0 ) {
      newProjects.push( projects[i] );
    }
  }
  return newProjects;
}

getBuildLabel = function(project) {
  var buildLabel = project.getAttribute('lastBuildLabel');
  if(buildLabel == undefined)
    buildLabel = "";
  else
    buildLabel = "#" + buildLabel;
  return buildLabel;
}

getCurrentStatus = function(lastStatus, activity) {
  if(activity == "building") {
    return utils.humanize(activity);
  }
  return utils.humanize(lastStatus);
}

getLastStatus = function(project) {
  if (!project.getAttribute('lastBuildStatus')) {
    return 'inactive';
  }
  return project.getAttribute('lastBuildStatus').toLowerCase();
}

emitBuildStatus = function () {
  socket.emit('build_status', {

  });
}


io.on('connection', function (socket) {

  request.get(pollUrl, function (error, response, body) {
    processXMLResponse(body);
    // emitBuildStatus();
  });

  // Poll for build status
  var lastBookingId;

  // setInterval(function() {
  //   request.get(pollUrl, function (error, response, body) {
  //     emitBuildStatus();
  //   });
  // }, settings.pollInterval);
});

server.listen(5005);
