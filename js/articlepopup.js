var articlepopmanager = {};
articlepopmanager.x=0;
articlepopmanager.y=0;
articlepopmanager.in_canvas=false;

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
  if(ap_image===""){
    $('#ap_image').hide();
  } else {
    $('#ap_image').load(function(){
      $('#ap_image').show('fade');
    });
    $('#ap_image').attr('src', img_url);
  }

  $('#ap_title').text(title);

  if(summary===""){
    $('#ap_summ').hide();
  } else {
    $('#ap_summ').text(summary);
    $('#ap_summ').show('blind');
  }
};

articlepopmanager.hide = function() {
  $('#articlepop').hide('fade');
};

articlepopmanager.showwikiarticle = function(article_title, in_canvas, x, y) {
  //update internal state...
  articlepopmanager.x=x;
  articlepopmanager.y=y;
  articlepopmanager.in_canvas=in_canvas;

  //update some stuff.
  $('#ap_image').hide();
  $('#ap_summ').hide();
  $('#ap_title').text('Loading...');
  $('#articlepop').show('fade');


  $.get("wikiParse.php",
        {title: article_title},
        function(data){
          var json = JSON.parse(data);
          var summary = json.summary.replace(/\[.*?\]/g,'').replace(/\(.*?\)/g, '');
          articlepopmanager.show(articlepopmanager.in_canvas,
            articlepopmanager.x, articlepopmanager.y, json.title,
            ((json.img==="")?"":"http:"+json.img), summary);

        });
};

//initialize on page buttons
$().ready(function(){
});
