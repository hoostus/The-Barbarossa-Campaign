// vim:ts=8 sw=8 noet

var player_setup = function(paper, hexes) {
	jQuery('#step-1').addClass('notice')
	jQuery('#instructions').dialog({
		title: 'Instructions',
		show: 'slide',
		width: 420,
		position: ['right', 'top']
	})

	var rumanian_dialog = jQuery('#rumanian').dialog({
		title: 'Rumanian Setup',
		show: 'slide',
		position: ['left', 'top'],
		autoOpen: true
	})
	var special_dialog = jQuery('#special').dialog({
		title: 'German Special Setup',
		show: 'slide',
		position: ['left', 'top'],
		autoOpen: false
	})
	var panzer_dialog = jQuery('#panzer').dialog({
		title: 'Panzer Setup',
		show: 'slide',
		position: ['left', 'top'],
		autoOpen: false
	})

	var contains = function(collection, element) {
		for (var i in collection) {
			if ((collection[i][0] == element[0]) && (collection[i][1] == element[1])) {
				return true
			}
		}
		return false
	}

	var invalid = paper.set()
	var valid = paper.set()
	var valid_hexes = [[11, 6], [11, 7], [12, 8]]
	for (var y = 1; y <= map_constants.num_hexes_tall; y++) {
		for (var x = 1; x <= map_constants.num_hexes_wide; x++) {
			if (contains(valid_hexes, [y, x])) {
				valid.push(hexes[y][x])
			} else {
				invalid.push(hexes[y][x])
			}
		}
	}

	invalid.animate({opacity: 0.2}, 1000, '>')
	valid.animate({'stroke-width': 5}, 1500, '<')

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

	var startFactory = function() {
		return function(x, y, mousedownevent, mousemoveevent) {
			this.ox = this.attr('x')
			this.oy = this.attr('y')
			this.toFront()
			return this;
		}
	}

	var finishFactory = function(next_unit, callback) {
		return function(dropped_on, x, y, event) {
			if (valid_droptarget(dropped_on)) {
				var y = dropped_on.raphael.map_coords[0]
				var x = dropped_on.raphael.map_coords[1]

				// make it snap to the middle of the hex
				var point = get_xy(y, x)
				this.animate({ x: point[0] + map_constants.rect_offset, y: point[1] + map_constants.rect_offset}, 100)

				if (callback) { callback() }
				if (next_unit) {
					next_unit.animate({opacity: 1}, 1000, 'bounce')
					next_unit.draggable()
				}
			} else {
				this.animate({x: this.ox, y: this.oy }, 300)
			}
		}
	}

	var panzer3 = paper.rect(1800, 500, map_constants.rect_size, map_constants.rect_size)
	panzer3.attr({fill: '#66666F', opacity: 0.3})
	panzer3.dragStart = startFactory()
	panzer3.dragFinish = finishFactory()

	var panzer2 = paper.rect(1700, 500, map_constants.rect_size, map_constants.rect_size)
	panzer2.attr({fill: '#66666F', opacity: 0.3})
	panzer2.dragStart = startFactory()
	panzer2.dragFinish = finishFactory(panzer3)

	var panzer1 = paper.rect(1600, 500, map_constants.rect_size, map_constants.rect_size)
	panzer1.attr({fill: '#66666F', opacity: 0.3})
	panzer1.dragStart = startFactory()
	panzer1.dragFinish = finishFactory(panzer2)

	var special = paper.rect(1800, 400, map_constants.rect_size, map_constants.rect_size)
	special.attr({fill: '#66666F', opacity: 0.3})
	special.dragStart = startFactory()
	special.dragFinish = finishFactory(panzer1, function() {
		jQuery('#step-2').removeClass('notice')
		jQuery('#step-3').addClass('notice')
		special_dialog.dialog('destroy')
		panzer_dialog.dialog('open')
	})

	var rumanian1 = paper.rect(1800, 300, map_constants.rect_size, map_constants.rect_size)
	rumanian1.attr({fill: '#B651E8', opacity: 0.3})
	rumanian1.dragStart = startFactory()
	rumanian1.dragFinish = finishFactory(special, function() {
		jQuery('#step-1').removeClass('notice')
		jQuery('#step-2').addClass('notice')
		rumanian_dialog.dialog('destroy')
		special_dialog.dialog('open')
	})

	var rumanian2 = paper.rect(1700, 300, map_constants.rect_size, map_constants.rect_size)
	rumanian2.attr({fill: '#B651E8'})
	rumanian2.draggable()
	rumanian2.dragStart = startFactory()
	rumanian2.dragFinish = finishFactory(rumanian1)

	// TODO: make previous unit types undraggable (i.e. when going to special, make rumanian undraggable
	// TODO: valid drop targets for special and panzer
	// TODO: fill in German line (after)
	// TODO: add a "done" that posts all the data back

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

	player_setup(paper, hexes)
})
