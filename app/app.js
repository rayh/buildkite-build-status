var request = require('request');
var express = require('express');

var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var jsdom   = require("jsdom-nogyp").jsdom;
var utils   = require("./utils");
var sass    = require("node-sass");

var settings = require('./config.json');

app.use(express.static(__dirname + '/../public'));

pollUrl = 'https://cc.buildbox.io/' + settings.project + '.xml?api_key=' + settings.apiKey + '&branch=master';

processXMLResponse = function(xml) {
  var doc = jsdom(xml);
  var projects = doc.getElementsByTagName('Project');
  var whitelisted = settings.whitelist;
  projects = applyWhitelist(projects, whitelisted);

  var statuses = [];

  for(var i = 0; i < projects.length; i++) {
    var project = projects[i];
    var projectName         = project.getAttribute('name');
    var projectActivity     = project.getAttribute('activity').toLowerCase();
    var projectStatus       = getCurrentStatus(getLastStatus(project), projectActivity);

    status = {
      name:                 utils.humanize(projectName),
      identifier:           utils.dasherize(projectName),
      status:               utils.dasherize(projectStatus),
      friendlyStatus:       projectStatus,
      timeStamp:            utils.friendlyDate(project.getAttribute('lastbuildtime')),
      buildNumber:          getBuildNumber(project)
    }
    statuses.push(status);
  }
  // console.log(statuses);
  return statuses;
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

getBuildNumber = function(project) {
  var buildLabel = project.getAttribute('lastbuildlabel');
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
  if (!project.getAttribute('lastbuildstatus')) {
    return 'inactive';
  }
  return project.getAttribute('lastbuildstatus').toLowerCase();
}

io.on('connection', function (socket) {

  request.get(pollUrl, function (error, response, body) {
    status = processXMLResponse(body);
    socket.emit('build_status', status);
  });

  // Poll for build status
  setInterval(function() {
    request.get(pollUrl, function (error, response, body) {
      status = processXMLResponse(body);
      socket.emit('build_status', status);
    });
  }, settings.pollInterval);
});

server.listen(5005);
