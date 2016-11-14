var circles = [];
var points = [];
var pointsDerivada1 = [];
var circleDerivada1 = [];
var pointsDerivada2 = [];
var pathsDervidada1 = [];
var evaluations = 500;
var pathsPolygonG = [];
var pathsCurve = [];



var showPoint = true;
var showPolygon = true;
var showCurve = true;
var showSecondCurve = true;
var showDerivada = true;


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

function getDerivada(){
	pathsDerivada1 = []
	var curve = []
  	if(points.length > 2){
  		for (var t = 0; t <= 1; t+=1/evaluations) {
    		var aux = [];
    		aux = points;
    		while (aux.length>1) {
                /* minhas alteracoes */
                // pegar os dois os ultimos pontos que geram o ponto da curva
                // no caso eles sao tangetes ao ponto da curva
                // e para achar o vetor da derivada do ponto da curva so subtrair esses pontos e multiplicar por n
                if(aux.length == 2) 
                {
                    var vetor = new Point(points.length-1*(aux[1].x - aux[0].x),points.length-1*(aux[1].y - aux[0].y));

                    //efetuar multiplicacao por escalar do vetor por (points.length - 1)
                    //esse vetor resultante é a 1 derivada da curva
                }
                /* fim das minhas alteracoes */
      			var aux2 = [];
      			for (var i = 0; i < aux.length-1; i++) {
        			var ponto = new Point((t*aux[i].x + (1-t)*aux[i+1].x), 
        				(t*aux[i].y + (1-t)*aux[i+1].y)) //interpolacao
        			aux2.push(ponto)
      			}
      			aux = aux2;
    	}
    	curve.push(vetor.x);
    	curve.push(vetor.y);
  	}
  	var curva = new Path(curve).moveTo(points[0].x,points[0].y).stroke('red', 1);
 	 pathsDerivada1.push(curva);
  }
  
}



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
        			var ponto = new Point((t*aux[i].x + (1-t)*aux[i+1].x), 
        				(t*aux[i].y + (1-t)*aux[i+1].y)) //interpolacao
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
		pathsDerivada1.forEach(function(circ) {
			stageObjects.push(circ)
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
		getDerivada()
		getDraw()
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
