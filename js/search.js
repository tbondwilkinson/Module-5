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
    var string = results.title+((results.namespace==0)?"":" (CATEGORY)");
    $('#searchpop').append(string+" ");
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
