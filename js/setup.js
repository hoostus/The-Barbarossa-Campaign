// vim:ts=8 sw=8 noet
jQuery(document).ready(function() {
	var paper = Raphael(0, 0, 2000, 1000);

	hexes = build_map(paper, false)

	jQuery('#step-1').addClass('notice')
	jQuery('#instructions').dialog({
		title: 'Instructions',
		show: 'slide',
		width: 420,
		position: ['right', 'top']
	})

	jQuery('#rumanian').dialog({
		title: 'Rumanian Setup',
		show: 'slide',
		position: 'top'
	})
	// 11,6 11,7 12,8
	var invalid = paper.set()
	var valid = paper.set()
	for (var y = 1; y < 14; y++) {
		for (var x = 1; x < 20; x++) {
			if ((y == 11 && x == 6) || (y == 11 && x == 7) || (y == 12 && x == 8)) {
				valid.push(hexes[y][x])
			} else {
				invalid.push(hexes[y][x])
			}
		}
	}
	invalid.animate({opacity: 0.2}, 1000, '>')
	valid.animate({'stroke-width': 5}, 1500, '<')

	var rect_size = 40 * 1.2
	var new_unit = paper.rect(1800, 300, rect_size, rect_size)
	new_unit.attr({fill: '#B651E8', opacity: 0.4})
	//new_unit.draggable()
	var new_unit = paper.rect(1700, 300, rect_size, rect_size)
	new_unit.attr({fill: '#B651E8'})
	new_unit.draggable()
	new_unit.dragStart = function(x, y, mousedownevent, mousemoveevent) {
		this.ox = this.attr('x')
		this.oy = this.attr('y')
		this.toFront()
		return this
	}
	new_unit.dragFinish = function(dropped_on, x, y, event) {
		var y_x = dropped_on.raphael.map_coords
		this.animate({x: this.ox, y: this.oy }, 300)
	}


	var new_unit = paper.rect(1800, 400, rect_size, rect_size)
	new_unit.attr({fill: '#666660', opacity: 0.3})

	var new_unit = paper.rect(1800, 500, rect_size, rect_size)
	new_unit.attr({fill: '#66666F', opacity: 0.3})
	var new_unit = paper.rect(1700, 500, rect_size, rect_size)
	new_unit.attr({fill: '#66666F', opacity: 0.3})
	var new_unit = paper.rect(1600, 500, rect_size, rect_size)
	new_unit.attr({fill: '#66666F', opacity: 0.3})
})
