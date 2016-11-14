var circles = [];
var points = [];
var pointsDerivada1 = [];
var circleDerivada1 = [];
var pointsDerivada2 = [];
var pathsPolygonDervidada1 = [];
var evaluations = 500;
var pathsPolygonG = [];
var pathsCurve = [];



var showPoint = true;
var showPolygon = true;
var showCurve = true;
var showSecondCurve = true;
var showDerivada = true;

function getPointsDer1(){
	var mult= points.length-1; // pontos de controle
	var deriv=[];
	var aux = [];
	var k;
	var j;
	for(var i=1;i<points.length;i++){
		k=mult*(points[i].x-points[i-1].x)
		j=mult*(points[i].y-points[i-1].y)
		deriv.push(new Point(k,j))
	}
	aux.push(deriv[0].x)
	aux.push(deriv[0].y)
	var curva = new Path(aux).moveTo(0,0).stroke('purple', 1);
 	 pathsPolygonDervidada1.push(curva);
}

stage.on('message:receivePontosBox', function(data) {
	showPoint = data.data;
	getDraw();
})

stage.on('message:receivePoligonalBox', function(data) {
	showPolygon = data.data;
	getDraw();
})

stage.on('message:receiveCurvaBox', function(data) {
	showCurve = data.data;
	getDraw();
})


function getCasteljau(){
	pathsCurve = []
	var curve = []
  	if(points.length > 2){
  		for (var t = 0; t <= 1; t+=1/evaluations) {
    		var aux = [];
    		aux = points;
    		while (aux.length>1) {
      			var aux2 = [];
      			for (var i = 0; i < aux.length-1; i++) {
        			var ponto = new Point((t*aux[i].x + (1-t)*aux[i+1].x), (t*aux[i].y + (1-t)*aux[i+1].y))
        			aux2.push(ponto)
      			}
      			aux = aux2;
    	}
    	curve.push(aux[0].x);
    	curve.push(aux[0].y);
  	}
  	var curva = new Path(curve).moveTo(0,0).stroke('purple', 1);
 	 pathsCurve.push(curva);
  }
  
}


var getDerivBz=function(curve){
	mult=curve.length-1; // pontos de controle
	deriv=[];
	for(var i=1;i<curve.length;i++){
		var k;
		k.x=mult*(curve[i].x-curve[i-1].x)
		k.y=mult*(curve[i].y-curve[i-1].y)
		deriv.push()
	}
	return deriv
}


function getDraw() {
	var stageObjects = []
	if(showCurve) {
		pathsCurve.forEach(function(curve) {
			stageObjects.push(curve)
		});
	}
	if(showPoint) {
		circles.forEach(function(circulo) {
			stageObjects.push(circulo)
		});
	}
	if(showPolygon) {
		pathsPolygonG.forEach(function(poli) {
			stageObjects.push(poli)
		})
	}
	if(showDerivada) {
		pathsPolygonDervidada1.forEach(function(dev) {
			stageObjects.push(dev)
		})
	}
	stage.children(stageObjects)
}

stage.on('click', function(e) {
	var exist = false;
	for(var i = 0; i < circles.length; i++) {
		if(e.target == circles[i]) {
			points[i].x = e.x
			points[i].y = e.y
			exist = true
		}
	}
	if(!exist) {
		circles.push(new Circle(e.x, e.y, 7).attr('fillColor', 'gray').on('drag', function(evt){
      		this.attr({x: evt.x, y:evt.y})
    	}));
		points.push(new Point(e.x, e.y))
	}
	if(circles.length > 0) {
		var pathsPolygon = [];
		for(var i = 0; i < circles.length-1; i++) {
			pathsPolygon.push(new Path([['moveTo', circles[i].attr('x'), circles[i].attr('y')],
			 					['lineTo', circles[i+1].attr('x'), circles[i+1].attr('y')]
			 					]).stroke('pink', 1))
		}

		pathsPolygonG = pathsPolygon
		getCasteljau()
		getDraw()
		getPointsDer1()
	}
});


stage.on('doubleclick', function(e) {
	for(var i = 0; i < circles.length; i++) {
		if(e.target == circles[i]) {
			circles.splice(i, 1)
			points.splice(i, 1)
		}
	}
	var pathsPolygon = []
	for(var i = 0; i < circles.length-1; i++) {
		pathsPolygon.push(new Path([['moveTo', circles[i].attr('x'), circles[i].attr('y')],
		 					['lineTo', circles[i+1].attr('x'), circles[i+1].attr('y')]
		 					]).stroke('pink', 1))
	}

	pathsPolygonG = pathsPolygon
	getDraw()
})
