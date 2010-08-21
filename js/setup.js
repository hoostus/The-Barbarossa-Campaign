// vim:ts=8 sw=8 noet

var make_all_invalid = function(paper, hexes) {
	var invalid = paper.set()
	for_all(function(y, x) {
		invalid.push(hexes[y][x])
	})
	invalid.animate({opacity: 0.2}, 1000, '>')
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
	var start_x = 1800
	var y = 300
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
			jQuery(unit).addClass(type, 'setup-unit')
			units[type].push(unit)
		}
		y += increment
	}

	return units
}

var contains = function(collection, element) {
	for (var i in collection) {
		if ((collection[i][0] == element[0]) && (collection[i][1] == element[1])) {
			return true
		}
	}
	return false
}

var do_setup = function(paper, hexes, units, allowed_hexes, post) {
	for (var i = 0; i < units.length; i++) {
		units[i].attr({opacity: 1})
	}

	// show the valid hexes

	var setup_hexes = []

	valid = paper.set()
	for_all(function(y, x) {
		if (contains(allowed_hexes, [y, x])) {
			valid.push(hexes[y][x])
		}
	})
	valid.animate({'stroke-width': 5, opacity: 1}, 1500, '<')
	valid.click(function(event) {
		var y = this.map_coords[0]
		var x = this.map_coords[1]
		setup_hexes.push([y, x])

		var point = get_xy(y, x)
		var unit = units.pop()
		debugger;
		unit.animate({x : point[0] + map_constants.rect_offset, y : point[1] + map_constants.rect_offset }, 800, '>')
		if (units.length == 0) {
			valid.animate({'stroke-width': 1, opacity: 0.2}, 1500, '>')
			post(setup_hexes)
		}
	})
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
		function(used_hexes) {
			jQuery('#step-1').removeClass('notice')
			jQuery('#step-2').addClass('notice')
			rumanian.dialog('destroy')
			special.dialog('open')

			var valid = [[12,8], [11,7], [11,6], [11,5], [6,5], [7,4], [8,5], [9,5], [10,5]]

			do_setup(paper, hexes, units['special'],
				valid.filter(function(x) { return !contains(used_hexes, x) }),
				function(used_hexes){
					jQuery('#step-2').removeClass('notice')
					jQuery('#step-3').addClass('notice')
					special.dialog('destroy')
					panzer.dialog('open')

					var valid = [[6,5], [7,4], [8,5], [9,5], [10,5]]
					do_setup(paper, hexes, units['panzer'],
						valid.filter(function(x) { return !contains(used_hexes, x) }),
						function(used_hexes) {
							jQuery('#step-3').removeClass('notice')
							panzer.dialog('destroy')
							jQuery.ajax({
								url: '/setup',
								type: 'POST',
								contentType: 'application/json',
								dataType: 'json',
								data: 123,
								success: function(data, textStatus, request) {
									alert(data)
								}
							})
					})
				})
		})
})
