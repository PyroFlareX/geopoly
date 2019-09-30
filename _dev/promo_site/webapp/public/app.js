

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.Stamen({
        layer: 'watercolor'
      })
    })
  ],
  target: 'app-map',
  view: new ol.View({
    center: [2172000, 5942000],
    zoom: 4
  })
});


const music1 = new Howl({
  src: ['http://yanny.nhely.hu/geo/theme.mp3']
});

music1.once('load', ()=>{
  music1.play();
});

   //  .fadeIn()
   // .loop()
   // .bind("timeupdate", function() {
   //    var timer = buzz.toTimer(this.getTime());
   //    document.getElementById("timer").innerHTML = timer;
   // });
