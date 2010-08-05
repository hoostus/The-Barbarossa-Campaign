// vim:ts=8 sw=8 noet
var paper = Raphael(0, 0, 2000, 1000);

build_map(paper, true)

// 1941 setup
(function() {
	var rect_size = width * 1.2
	var rect_offset = 25

	var fill = function (units, color, extra_offset) {
		var extra_offset = extra_offset || 0
		for (u in units) {
			var unit = units[u]
			var point = get_hex_coord(unit[0], unit[1])
			var new_unit = paper.rect(point[0] + rect_offset + extra_offset, point[1] + rect_offset + extra_offset, rect_size, rect_size)
			new_unit.attr({fill: color})
			new_unit.draggable()
			new_unit.dragFinish = function(dropped_on, x, y, event) {
				// make it "snap to" to hex
				var y_x = dropped_on.raphael.map_coords
				var point = get_hex_coord(y_x[0], y_x[1])
				this.animate({x: point[0] + rect_offset, y: point[1] + rect_offset}, 100)
			}
		}
	}

	var finns = [
		[1, 7],
		[2, 7]
	]
	fill(finns, 'white')

	var ussr = [
		[1, 8],
		[2, 8],
		[5, 4],
		[5, 5],
		[6, 6],
		[7, 5],
		[8, 6],
		[9, 6],
		[10, 6],
		[10, 7],
		[10, 8],
		[11, 8],
		[12, 9]
	]
	fill(ussr, 'red')

	var rumanian = [
		[12, 8],
		[11, 6]
	]
	fill(rumanian, '#B651E8')

	var german = [
		[6, 5],
		[7, 4],
		[8, 5],
		[9, 5],
		[10, 5],
		[11, 5]
	]
	fill(german, '#A8BFAB')

	var german_mountain = [[11, 7]]
	fill(german_mountain, '#666666')

	var panzer = [
		[6, 5],
		[8, 5],
		[9, 5]
	]
	fill(panzer, '#666666', 5)
})();


