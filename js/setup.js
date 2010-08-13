// vim:ts=8 sw=8 noet

	// TODO: make previous unit types undraggable (i.e. when going to special, make rumanian undraggable
	// TODO: valid drop targets for special and panzer
	// TODO: fill in German line (after)
	// TODO: add a "done" that posts all the data back

var make_all_invalid = function(paper, hexes) {
	var invalid = paper.set()
	for_all(function(y, x) {
		invalid.push(hexes[y][x])
	})
	invalid.animate({opacity: 0.2}, 1000, '>')
}

var startFactory = function() {
	return function(x, y, mousedownevent, mousemoveevent) {
		this.ox = this.attr('x')
		this.oy = this.attr('y')
		this.toFront()
		return this;
	}
}

var valid_droptarget = function(target) {
	if (target == null) {
		return false;
	}
	if (!target['raphael']) {
		return false;
	}
	if (!target.raphael['map_coords']) {
		return false;
	}

	var y = target.raphael.map_coords[0]
	var x = target.raphael.map_coords[1]

	if (contains(valid_hexes, [y, x])) {
		return true;
	} else {
		return false;
	}
}

var finishFactory = function(fn) {
	return function(dropped_on, x, y, event) {
		if (valid_droptarget(dropped_on)) {
			var y = dropped_on.raphael.map_coords[0]
			var x = dropped_on.raphael.map_coords[1]

			// make it snap to the middle of the hex
			var point = get_xy(y, x)
			this.animate({ x: point[0] + map_constants.rect_offset, y: point[1] + map_constants.rect_offset}, 100)
			fn()
		} else {
			this.animate({x: this.ox, y: this.oy }, 300)
		}
	}
}

var draw_pieces = function(paper, pieces) {
	for (var key in pieces) {
		var units = pieces[key]
		for (var i = 0; i < units.length; i++) {
			var position = units[i]
			var unit = make_rect(position[0], position[1], paper)
			var color = function(key) {
				if (key == 'finnish') { return '#F0EAE6' }
				else if (key == 'ussr_line') { return 'red' }
			}(key)
			unit.attr({fill: color})
		}
	}
}

var draw_setup_units = function(paper) {
	var start_x = 250
	var y = 700
	//var start_x = 1800
	//var y = 300
	var increment = 100

	var setup = {
		rumanian : { count : 2, color: '#b651e8' },
		special : { count : 1, color : 'green' },
		panzer :  { count : 3, color : 'green' }
	}

	var units = {}

	for (var type in setup) {
		units[type] = []
		var details = setup[type]
		var x = start_x
		for (var i = 0; i < details['count']; i++, x -= increment) {
			var unit = paper.rect(x, y, map_constants.rect_size, map_constants.rect_size)
			unit.attr({opacity: 0.3, fill: details['color']})
			units[type].push(unit)
		}
		y += increment
	}

	return units
}

var do_setup = function(paper, hexes, units, allowed_hexes, post) {
	// show the valid hexes
	var contains = function(collection, element) {
		for (var i in collection) {
			if ((collection[i][0] == element[0]) && (collection[i][1] == element[1])) {
				return true
			}
		}
		return false
	}

	valid = paper.set()
	for_all(function(y, x) {
		if (contains(allowed_hexes, [y, x])) {
			valid.push(hexes[y][x])
		}
	})
	valid.animate({'stroke-width': 5}, 1500, '<')

	var unit = units.pop()
	unit.animate({opacity: 1}, 1000, 'bounce')
	unit.dragStart = startFactory()
	unit.dragFinish = finishFactory()
	unit.draggable()

	post()
}

jQuery(document).ready(function() {
	var paper = Raphael(0, 0, 2000, 1000);
	hexes = build_map(paper, false)

	jQuery.ajax({
		url: '/setup',
		async: false,
		dataType: 'json',
		success: function(pieces) {
			draw_pieces(paper, pieces)
		}
	})

	make_all_invalid(paper, hexes)

	var instructions = jQuery('#instructions').dialog({
		title: 'Instructions',
		show: 'slide',
		width: 420,
		position: ['right', 'top'],
	})

	var rumanian = jQuery('#rumanian').dialog({
		title: 'Rumanian Setup',
		show: 'slide',
		position: ['left', 'top'],
	})

	var special = jQuery('#special').dialog({
		title: 'German Special Setup',
		show: 'slide',
		position: ['left', 'top'],
		autoOpen: false
	})

	var panzer = jQuery('#panzer').dialog({
		title: 'Panzer Setup',
		show: 'slide',
		position: ['left', 'top'],
		autoOpen: false
	})

	var units = draw_setup_units(paper)
	jQuery('#step-1').addClass('notice')
	do_setup(paper, hexes, units['rumanian'],
		[[11, 6], [11, 7], [12, 8]],
		function() {})
})
