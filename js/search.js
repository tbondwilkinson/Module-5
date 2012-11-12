var searchmanager = {};

searchmanager.execsearch = function() {
  var querystr = $('#search').val();

  //let's goooooo
  $.get("search.php", { query: querystr }, searchmanager.searchcallback);
}

searchmanager.searchcallback = function(data) {
  var results = JSON.parse(data);

  $('#searchpop').html('');

  for(var i=0; i < results.length; i++) {
    var string = results[i].title+((results[i].namespace==0)?"":" (CATEGORY)");
    $('#searchpop').append('<a href="#" id="searchlink'+i+'">'+results[i].title+'</a>');
    $('#searchlink'+i).click(bindText(results[i].title));
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
    $('#searchpop').hide('Blind');
  });

  //handle search
  $('#search').keypress(function(event){
    searchmanager.execsearch();
  });

});
