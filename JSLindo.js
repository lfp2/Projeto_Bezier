stage.on('click', function(e) {
	new Circle(e.x, e.y, 5).attr('fillColor', 'gray').addTo(stage)
});
