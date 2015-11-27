var moment = require("moment");

module.exports = {
  humanize: function(str) {
    str = str.replace(/-/g, ' ');
    words = str.split(' ');

    for(var i = 0; i < words.length; i++) {
      if (words[i].length > 0) {
        var letters = words[i].split('');
        var firstLetter = letters.shift();
        words[i] = firstLetter.toUpperCase() + letters.join('');
      }
    }
    return words.join(' ');
  },

  dasherize: function(str) {
    return str.replace(/([\s\(\)\-]+)/g, '-').replace(/\-$/, '').toLowerCase();
  },

  friendlyDate: function(timestamp) {
    if(timestamp == undefined) return "N/A"

    time = moment(timestamp).fromNow();
    return time;
  },

  nameComparison: function(a, b) {
    name1 = a.getAttribute('name').toLowerCase()
    name2 = b.getAttribute('name').toLowerCase()
    if (name1 < name2) { return -1; }
    if (name1 > name2) { return 1; }
    return 0;
  }
}
