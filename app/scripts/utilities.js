BuildboxMonitor.utilities = {

  humanize: function(str) {
    str = str.replace(/-/g, ' ');
    words = str.split(' ');

    for(var i = 0; i < words.length; i++) {
      var letters = words[i].split('');
      var firstLetter = letters.shift();
      words[i] = firstLetter.toUpperCase() + letters.join('');
    }

    return words.join(' ');
  },

  dasherize: function(str) {
    return str.replace(/([\s\(\)]+)/g, '-').replace(/\-$/, '').toLowerCase();
  }

}
