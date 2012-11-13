var articlepopmanager = {};

/* x_coord and y_coord are relative to the canvas, if in_canvas is true */
articlepopmanager.show = function(title, img_url, summary) {
  /* position article popup */
  

  /* initialize article popup contents */
  if(img_url===""){
    $('#ap_image').hide();
  } else {
    if(img_url===$('#ap_image').attr('src')) {
      $('#ap_image').show('blind');
    } else {
      $('#ap_image').load(function(){
        $('#ap_image').show('blind');
      });
      $('#ap_image').attr('src', img_url);
    }      
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
  if(in_canvas){
    $('#articlepop').css('left', x);
    $('#articlepop').css('top', y+177);
  } else {
    $('#articlepop').css('left',0);
    $('#articlepop').css('top',0);
  }

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
          articlepopmanager.show(json.title,
            ((json.img==="")?"":"http:"+json.img), summary);

        });
};

//initialize on page buttons
$().ready(function(){
});
