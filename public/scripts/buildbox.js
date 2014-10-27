var buildsPerRow = 2, rendered = [];

var process = function(projects) {
  var builds = document.getElementsByClassName('builds');
  if(rendered.length == 0) { buildRows(builds, projects); }

  for(var i = 0; i < projects.length; i++) {
    console.info("looping...");

    var project = projects[i];
    var currentRow = document.getElementById("row" + Math.ceil((i+1) / buildsPerRow));

    if(rendered.indexOf(project.identifier) > -1) {
      updateStatus(project);
    } else {
      renderRow(currentRow, project);
      rendered.push(project.identifier);
    }
  }
}

var buildRows = function(builds, projects) {
  var rows = Math.ceil(projects.length / buildsPerRow);
  var rowHtml = '';
  for(var i = 0; i < rows; i++) {
    rowHtml += tmpl("row_template", { rowNumber: (i+1) });
  }
  builds[0].innerHTML = rowHtml;
}

var updateStatus = function(project) {
  var build = document.getElementById(project.identifier);
  build.className = 'build build--' + project.status;
  build.getElementsByClassName('build__status')[0].innerHTML      = project.friendlyStatus;
  build.getElementsByClassName('build__name')[0].innerHTML        = project.name;
  build.getElementsByClassName('build__number')[0].innerHTML      = project.buildNumber;
  build.getElementsByClassName('build__time-stamp')[0].innerHTML  = project.timeStamp;
}

var renderRow = function(row, project){
  html = row.innerHTML;
  html += tmpl("build_template", project);
  row.innerHTML = html;
}
