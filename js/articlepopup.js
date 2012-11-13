var articlepopmanager = {};
var articlepopmanager.x=0;
var articlepopmanager.y=0;
var articlepopmanager.in_canvas=false;

/* x_coord and y_coord are relative to the canvas, if in_canvas is true */
articlepopmanager.show = function(in_canvas, x_coord, y_coord, title, img_url, summary) {
  /* position article popup */
  if(in_canvas){
    $('#articlepop').css('left', x_coord);
    $('#articlepop').css('top', y_coord+177);
  } else {
    $('#articlepop').css('left',0);
    $('#articlepop').css('top',0);
  }

  /* initialize article popup contents */
  if(ap_image==""){
    $('#ap_image').hide();
  } else {
    $('#ap_image').attr('src', img_url);
    $('#ap_image').show();
  }

  $('#ap_title').text(title);

  if(summary==""){
    $('#ap_summ').hide();
  } else {
    $('#ap_summ').text(summary);
    $('#ap_summ').show();
  }

  /* show it */
  $('#articlepop').show('fade');
}

articlepopmanager.hide = function() {
  $('#articlepop').hide('fade');
}

articlepopmanager.showwikiarticle = function() {

}

//initialize on page buttons
$().ready(function(){
});
