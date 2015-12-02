var request = require('request');
var express = require('express');

var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var jsdom   = require('jsdom-nogyp').jsdom;
var utils   = require("./utils");
var sass    = require('node-sass');
var fs      = require('fs');
var moment  = require('moment');

var settings;

settings = ( require('./config.json') );

app.use(express.static(__dirname + '/../public'));

pollUrl = 'https://cc.buildkite.com/' + settings.project + '.xml?api_key=' + settings.apiKey + '&branch='+settings.branch;

processXMLResponse = function(xml) {
  var doc = jsdom(xml);
  var projects = doc.getElementsByTagName('Project');
  projects = activeProjects(projects);

  var statuses = [];

  for(var i = 0; i < projects.length; i++) {
    var project = projects[i];
    var projectName           = project.getAttribute('name');
    var projectActivity       = project.getAttribute('activity').toLowerCase();
    var projectPriorStatus    = getPriorStatus(project);
    var projectCurrentStatus  = getCurrentStatus(projectPriorStatus, projectActivity);

    status = {
      name:                 utils.humanize(projectName).replace(/\s\(.*?\)/, ''),
      identifier:           utils.dasherize(projectName),
      priorStatus:          utils.humanize(projectPriorStatus),
      dashedPriorStatus:    utils.dasherize(projectPriorStatus),
      status:               utils.humanize(projectCurrentStatus),
      dashedStatus:         utils.dasherize(projectCurrentStatus),
      timeStamp:            utils.friendlyDate(project.getAttribute('lastbuildtime')),
    }
    statuses.push(status);
  }
  return statuses;
}

activeProjects = function(projects) {
  projectsWithActivity = []
  var now = moment();

  for(var i = 0; i < projects.length; i++) {
    var date_modified = moment(projects[i].getAttribute('lastbuildtime'));
    if( isNotBlacklisted(projects[i]) && ( (date_modified && Math.ceil(now.diff(date_modified, 'days', true)) <= settings.daysInactive) || projects[i].getAttribute('activity').toLowerCase() == 'building' ) ) {
      projectsWithActivity.push(projects[i]);
    }
  }
  return projectsWithActivity.sort(utils.nameComparison);
}

isNotBlacklisted = function(project) {
  var branchRegex = new RegExp(" \\(" + settings.branch + "\\)$");
  var projectNoBranch = utils.dasherize(project.getAttribute('name').toLowerCase().replace(branchRegex, ''));
  return (settings.blacklist.indexOf( projectNoBranch ) < 0);
}

getCurrentStatus = function(priorStatus, activity) {
  if(activity == "building") {
    return activity;
  }
  return priorStatus;
}

getPriorStatus = function(project) {
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
