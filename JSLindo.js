stage.on('click', function(e) {
	circles.push(new Circle(e.x, e.y, 4)
						.addTo(stage)
						.attr('fillColor', 'gray'));
});