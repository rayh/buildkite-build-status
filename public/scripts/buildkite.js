var buildkite = {

  buildsPerRow: 1,
  rendered: [],

  process: function(projects) {
    var builds = document.getElementsByClassName('builds');
    if(this.rendered.length == 0) { this.buildRows(builds, projects); }

    for(var i = 0; i < projects.length; i++) {
      console.info("looping...");

      var project = projects[i];
      var currentRow = document.getElementById("row" + Math.ceil((i+1) / this.buildsPerRow));

      if(this.rendered.indexOf(project.identifier) > -1) {
        this.updateStatus(project);
      } else {
        this.renderRow(currentRow, project);
        this.rendered.push(project.identifier);
      }
    }
  },

  buildRows: function(builds, projects) {
    var rows = Math.ceil(projects.length / this.buildsPerRow);
    var rowHtml = '';
    for(var i = 0; i < rows; i++) {
      rowHtml += tmpl("row_template", { rowNumber: (i+1) });
    }
    builds[0].innerHTML = rowHtml;
  },

  updateStatus: function(project) {
    var build = document.getElementById(project.identifier);
    build.className                                                   = 'build build--' + project.dashedStatus;
    build.getElementsByClassName('prior-status')[0].className         = 'prior-status prior-status--' + project.dashedPriorStatus;
    build.getElementsByClassName('build__status')[0].innerHTML        = project.status;
    build.getElementsByClassName('build__name')[0].innerHTML          = project.name;
    build.getElementsByClassName('build__number')[0].innerHTML        = project.buildNumber;
    build.getElementsByClassName('build__time-stamp')[0].innerHTML    = project.timeStamp;
    build.getElementsByClassName('prior-status__status')[0].innerHTML = project.priorStatus;
  },

  renderRow: function(row, project){
    html = row.innerHTML;
    html += tmpl("build_template", project);
    row.innerHTML = html;
  }

}

exports.buildkite = buildkite;
