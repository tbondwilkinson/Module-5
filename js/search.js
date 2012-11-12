var searchmanager = {};



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
  $('#search').focus(function(event){
    alert('searchbox has'+$('search').val());
  });

});
