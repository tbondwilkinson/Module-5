var searchmanager = {};

searchmanager.addunderscores = function(string) {
    var temp = string;
    var index = temp.indexOf(" ");
    while (index != -1) {
        temp = temp.replace(" ", "_");
        index = temp.indexOf(" ");
    }
    return temp;
}

searchmanager.execsearch = function() {
  var querystr = searchmanager.addunderscores($('#search').val());

  //let's goooooo
  $.get("search.php", { query: querystr }, searchmanager.searchcallback);
}

searchmanager.searchcallback = function(data) {
  var results = JSON.parse(data);

  $('#searchpop').html('');

  for(var i=0; i < results.length; i++) {
    var string = results[i].title+((results[i].namespace==0)?"":" (CATEGORY)");
    $('#searchpop').append('<a href="#'+results[i].title+'" id="searchlink'+i+'">'+sanitize(results[i].title)+'</a>');
    $('#searchlink'+i).click(reloadVisualizerForPage(results[i].title));
  }
}

//initialize on page buttons
$().ready(function(){
  //handle focus
  $('#search').focus(function(event){
    $('#searchpop').show('Blind');
  });

  //handle unfocus
  $('#search').blur(function(event){
    $('#searchpop').delay(500).hide('Blind');
  });

  //handle search
  $('#search').keypress(function(event){
    searchmanager.execsearch();
  });

});
