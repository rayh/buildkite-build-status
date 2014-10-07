(function() {

  var url = 'https://cc.buildbox.io/' + Settings.project + '.xml?api_key=' + Settings.apiKey;

  var fetchBuildStatus = function(callback) {
    var request = new XMLHttpRequest();
    request.onload = function(result) {
      callback(null, result.target.responseXML);
    }
    request.open("get", url);
    request.send();
  }

  var humanize = function(str) {
    str = str.replace(/-/g, ' ');
    words = str.split(' ');

    for(var i = 0; i < words.length; i++) {
      var letters = words[i].split('');
      var firstLetter = letters.shift();
      words[i] = firstLetter.toUpperCase() + letters.join('');
    }

    return words.join(' ');
  }

  var rendered = [];

  var process = function(xml) {
    var projects = xml.getElementsByTagName('Project');
    var builds = document.getElementsByClassName('builds');

    for(var i = 0; i < projects.length; i++) {
      var name = projects[i].getAttribute('name').replace(/\s/g, '-');
      var activity = projects[i].getAttribute('activity').toLowerCase();
      var lastStatus = (projects[i].getAttribute('lastBuildStatus'))
        ? projects[i].getAttribute('lastBuildStatus').toLowerCase()
        : 'unknown';


      if(rendered.indexOf(name) > -1) {
        var build = document.getElementById(name);
        build.className = 'build ' + activity + ' ' + lastStatus;
        build.innerHTML = humanize(lastStatus);
      } else {
        html = builds[0].innerHTML;
        html += '<h2>' + humanize(name) + '</h2>';
        html += '<div id="' + name + '" class="build ' + activity + ' ' + lastStatus + '">' + humanize(lastStatus) + '<div>';
        builds[0].innerHTML = html;
        rendered.push(name);
      }
    }
  }

  fetchBuildStatus(function(error, xml) {
    process(xml);
  });

  setInterval(function() {
    fetchBuildStatus(function(error, xml) {
      process(xml);
    });
  }, Settings.pollInterval);


})();
