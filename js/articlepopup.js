var articlepopmanager = {};

/* x_coord and y_coord are relative to the canvas, if in_canvas is true */
articlepopmanager.show = function(in_canvas, x_coord, y_coord, title, img, desc) {

}

articlepopmanager.hide = function() {
  
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
