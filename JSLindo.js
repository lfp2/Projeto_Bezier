var circles = [];
var points = [];
var pointsDerivada1 = [];
var circleDerivada1 = [];
var pointsDerivada2 = [];
var pathsDerivada1 = [];
var evaluations = 500;
var pathsPolygonG = [];
var pathsCurve = [];
var range = 50;
var curve;
var curveDer;
var vetorDev;
var vetorDev2;
var curveDer2;

var showPoint = true;
var showPolygon = true;
var showCurve = true;
var showSecondCurve = true;
var showDerivada = true;


stage.on('message:receiveEvaluation', function(data) {
	evaluations = data.data;
	getCasteljau();
	getDraw();
})

stage.on('message:receivePontosBox', function(data) {
	showPoint = data.data;
	getDraw();
})

stage.on('message:receivePoligonalBox', function(data) {
	showPolygon = data.data;
	getDraw();
})

stage.on('message:receiveRange', function(data) {
	pathsDerivada1 = [];
	range =1-data.data/100.0;
	range*=curve.length/2;
	range=parseInt(range);
	vetorDev=new Path([curve[2*range],curve[2*range+1],curve[2*range]+curveDer[2*range],curve[2*range+1]+curveDer[2*range+1]]); //"Seta da Derivada"
	vetorDev.moveTo(0,0).stroke('red', 1);
	pathsDerivada1.push(vetorDev);
	vetorDev2=new Path([curve[2*range],curve[2*range+1],curve[2*range]+curveDer2[2*range],curve[2*range+1]+curveDer2[2*range+1]]);
	getDraw();
})

stage.on('message:receiveCurvaBox', function(data) {
	showCurve = data.data;
	getDraw();
})

/*
function getDerivada(){
	pathsDerivada1 = []
	curveDer = []
  	if(points.length > 2){
  		for (var t = 0; t <= 1; t+=1/evaluations) {
    		var aux = [];
    		aux = points;
    		while (aux.length>1) {
                /* minhas alteracoes 
                // pegar os dois os ultimos pontos que geram o ponto da curva
                // no caso eles sao tangetes ao ponto da curva
                // e para achar o vetor da derivada do ponto da curva so subtrair esses pontos e multiplicar por n
                if(aux.length == 2) 
                {
                    var vetor = new Point((points.length-1)*(aux[1].x - aux[0].x),(points.length-1)*(aux[1].y - aux[0].y));
                    //efetuar multiplicacao por escalar do vetor por (points.length - 1)
                    //esse vetor resultante é a 1 derivada da curva
                }
                /* fim das minhas alteracoes 
      			var aux2 = [];
      			for (var i = 0; i < aux.length-1; i++) {
        			var ponto = new Point((t*aux[i].x + (1-t)*aux[i+1].x), 
        				(t*aux[i].y + (1-t)*aux[i+1].y)) //interpolacao
        			aux2.push(ponto)
      			}
      			aux = aux2;
    	}
    	curveDer.push(vetor.x);
    	curveDer.push(vetor.y);
  	}
  }
  
}
*/



function getCasteljau(){
	pathsCurve = []
	curve = []
	curveDer = []
	curveDer2 = []
  	if(points.length > 2){
  		for (var t = 0; t <= 1; t+=1/evaluations) {
    		var aux = [];
    		var auxDerivative = [];
    		aux = points;
    		auxDerivative = pointsDerivada2
    		while (aux.length>1) {
      			var aux2 = [];
      			var aux2derivate = [];
      			if(aux.length == 2) 
                {
                    var vetor = new Point((points.length-1)*(aux[1].x - aux[0].x),(points.length-1)*(aux[1].y - aux[0].y));
                    //efetuar multiplicacao por escalar do vetor por (points.length - 1)
                    //esse vetor resultante é a 1 derivada da curva
                }
      			for (var i = 0; i < aux.length-1; i++) {
        			var ponto = new Point((t*aux[i].x + (1-t)*aux[i+1].x), 
        				(t*aux[i].y + (1-t)*aux[i+1].y)) //interpolacao
        			aux2.push(ponto)
        			if(i >= aux2derivate.length) continue;
                    ponto = new Point((t*aux2derivate[i].x + (1-t)*aux2derivate[i+1].x), 
        				(t*aux2derivate[i].y + (1-t)*aux2derivate[i+1].y));
        			aux2derivate.push(ponto);
      			}
      			aux = aux2;
      			auxDerivative = aux2derivate
    	}
    	curveDer.push(vetor.x);
    	curveDer.push(vetor.y);
    	if(auxDerivative.length > 0){
    		curveDer2.push(auxDerivative[0].x);
    		curveDer2.push(auxDerivative[0].y);
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
		pathsDerivada1.forEach(function(poli) {
			stageObjects.push(poli)
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
		if(points.length > 2){
			var n = points.length - 1;
			var pontoDer = new Point(((points[n].x - 2) * points[n - 1].x + points[n-2].x),((points[n].y - 2) * points[n - 1].y + points[n-2].y))
    		pointsDerivada2.push(pontoDer);
		}
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
		//getDerivada()
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
	pathsDerivada1 = []
	getCasteljau()
	getDraw()
})

