var stageOvjects = []
var circles = []
var points = []
var controlPoints = []
var curve = null
var segundaCurva = null
var controlLines = []

var showPoligonal = true
var showCurva = true
var showSegundaCurva = true
var showPontos = true


stage.on('click', function(e) {
	var existe = false
	for(var i =0; i < circles.length; i++){
		if(circles[i] == e.target){
			points[i].x = e.x
			points[i].y = e.y
			existe = true
		}
	}
	if(!existe){
		circles.push(new Circle(e.x, e.y, 5).attr('fillColor', 'gray').on('drag', function(evt){
      this.attr({x: evt.x, y:evt.y});
    }));
	}
});


