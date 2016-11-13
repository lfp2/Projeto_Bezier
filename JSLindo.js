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
	if(!existe){
		circles.push(new Circle(e.x, e.y, 5).attr('fillColor', 'gray').addTo(stage))
		points.push(new Point(e.x, e.y))
	}
});


