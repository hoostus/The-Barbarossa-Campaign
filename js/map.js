var map_constants = {
	width : 40,

	num_hexes_wide : 19,
	num_hexes_tall : 13,

	start_x : 50,
	start_y : 50,

	rect_size : 40 * 1.2,
	rect_offset : 25
}

var for_all = function(fn) {
	for (var y = 1; y <= map_constants.num_hexes_tall; y++) {
		for (var x = 1; x <= map_constants.num_hexes_wide; x++) {
			fn(y, x)
		}
	}
}

var make_rect = function(y, x, paper) {
	var point = get_xy(y, x)
	return paper.rect(point[0] + map_constants.rect_offset,
		point[1] + map_constants.rect_offset, 
		map_constants.rect_size,
		map_constants.rect_size)
	}

// given Y, X (map grid) return X, Y (canvas space)
var get_xy = (function() {
	var offset = 1.77 * map_constants.width

	var jag = function(row) {
		if (row % 2 == 0) {
			return 0
		} else {
			return offset / 2
		}
	}

	return function(y, x) {
		return [(x * offset) + jag(y), y * offset * 0.865]
	}
})();

var build_map = function(paper, debug) {
	var debug = debug || false

	var hex_sides = 6;

	var hex = function(x, y) {
		var new_hex = paper.polygon(map_constants.start_x + x, map_constants.start_y + y, map_constants.width, hex_sides)
		new_hex.attr({fill: 'white'})
		new_hex.hover(function(event) {
			this.ostroke_width = this.attr('stroke-width') || 1
			this.attr({'stroke-width' : 7})
		}, function(event) {
			this.attr({'stroke-width' : this.ostroke_width})
		})
		new_hex.node.setAttribute('class', 'hex')
		return new_hex
	}


	var hexes = [];

	// build hex grid
	(function(hexes) {
		for (var y = 1; y <= map_constants.num_hexes_tall; y++) {
			hexes[y] = []
			for (var x = 1; x <= map_constants.num_hexes_wide; x++) {
				var coord = get_xy(y, x)
				var new_hex = hex(coord[0], coord[1])
				new_hex.node.id = 'y' + y + 'x' + x
				//new_hex.map_coords = [y, x]
				//new_hex.attr({title: y + ':' + x})
				hexes[y][x] = new_hex
			}
		}
	})(hexes);

	// fill in numbers on all hexes (to verify that the map is done properly
	var draw_hexnum = function() {
		for (var x = 1; x < 20; x++) {
			for (var y = 1; y < 14; y++) {
				var point = get_xy(y, x)
				paper.text(point[0] + map_constants.start_x, point[1] + map_constants.start_y, y + ":" + x).toBack()
			}
		}
	}
	if (debug) { draw_hexnum() }

	// setup all the "out of bounds regions"
	(function() {
		var endings = { 1: 13, 2: 14, 3: 16, 4: 17, 5: 16, 6: 17, 7: 18, 8: 19, 9: 18 } // after that is the Caspian sea
		var oob = paper.set()

		for (var y = 1; y < 10; y++) {
			for (var x = 1; x < 20; x++) {
				if (x > endings[y]) {
					oob.push(hexes[y][x])
				}
			}
		}

		//oob.attr({fill: 'black'})
		oob.remove()
	})();

	// setup all the water regions on the board
	(function() {
		var water = paper.set();

		// setup the Baltic Sea
		var deadleft = [null, 6, 6, 5, 6, 4, 4]
		for (var y = 1; y < 7; y++) {
			for (var x = 1; x < 7; x++) {
				if (x < deadleft[y]) {
					water.push(hexes[y][x])
				}
			}
		}

		// the lake by leningrad
		water.push(hexes[2][9])
		// the sea of azov ... can units actually go here?
		//water.push(hexes[12][12])

		// the black sea
		water.push(hexes[12][10])
		for (var x = 8; x < 13; x++) {
			water.push(hexes[13][x])
		}

		// the caspian sea
		water.push(hexes[10][19])
		water.push(hexes[11][18])
		water.push(hexes[11][19])
		water.push(hexes[12][19])
		water.push(hexes[13][19])

		water.attr({fill: 'blue'})
	})();

	// set up the major cities
	(function() {
		var major_cities = {
			Berlin : [8, 1],
			Moscow : [5, 11],
			Leningrad : [2, 8],
			Stalingrad : [9, 15]
		}

		for (var city in major_cities) {
			var point = major_cities[city]
			hexes[point[0]][point[1]].attr({fill : '#5E5E5E'})
			point = get_xy(point[0], point[1])
			// the city names clutter things up when we've also printed the map
			// coordinates on every hex
			if (!debug) {
				paper.text(point[0] + map_constants.start_x, point[1] + map_constants.start_y, city).toBack()
			}
		}
	})();

	// set up the minor cities
	(function() {
		var minor_cities = {
			Helsinki : [2, 6],
			Talinin : [3, 5],
			Vologda : [3, 11],
			Riga : [5, 5],
			Konigsberg : [6, 4],
			Smolensk : [6, 10],
			Stetin : [7, 1],
			Danzig : [7, 3],
			Minsk : [7, 7],
			Voronezh : [7, 13],
			Warsaw : [8, 5],
			'Brest-Litovsk' : [8, 6],
			Kiev : [9, 8],
			Kharkov : [9, 11],
			Prague : [10, 2],
			Astrakan : [10, 18],
			Vienna : [11, 2],
			Rostov : [11, 12],
			Budapest : [12, 4],
			Odessa : [12, 9],
			Sevastopol : [12, 11],
			Belgrade : [13, 3],
			Ploesti : [13, 7]
		}

		for (var city in minor_cities) {
			var point = minor_cities[city]
			hexes[point[0]][point[1]].attr({fill : '#D1CDCD'})
			point = get_xy(point[0], point[1])
			// the city names clutter things up when we've also printed the map
			// coordinates on every hex
			if (!debug) {
				paper.text(point[0] + map_constants.start_x, point[1] + map_constants.start_y, city).toBack()
			}

		}
	})();

	// all of the "rough terrain" behaves identically but has a different cosmetic appearance
	// swamps
	(function() {
		var swamps = [
			[1, 6],
			[1, 7],
			[1, 10],
			[3, 7],
			[3, 8],
			[3, 9],
			[8, 7],
			[8, 8],
			[8, 9],
			[9, 18],
			[11, 17],
			[12, 17],
			[12, 18]
		]

		for (s in swamps) {
			var swamp = swamps[s]
			hexes[swamp[0]][swamp[1]].attr({fill: '#4A613B'})
		}
	})();

	// forests
	(function() {
		var forests = [
			[1, 8],
			[1, 11],
			[1, 12],
			[1, 13],
			[2, 10],
			[2, 11],
			[2, 12],
			[2, 13],
			[2, 14],
			[3, 12],
			[3, 13],
			[3, 14],
			[4, 7],
			[4, 9],
			[4, 10],
			[4, 11],
			[4, 13],
			[4, 17],
			[5, 12],
			[5, 15],
			[6, 14],
			[6, 17],
			[7, 15],
			[7, 18]
		]

		for (f in forests) {
			var forest = forests[f]
			hexes[forest[0]][forest[1]].attr({fill: '#77E334'})
		}
	})();

	// mountains
	(function() {
		var mountains = [
			[11, 4],
			[11, 5],
			[11, 6],
			[12, 7],
			[13, 13],
			[13, 14],
			[13, 15],
			[13, 16]
		]

		for (m in mountains) {
			var mountain = mountains[m]
			hexes[mountain[0]][mountain[1]].attr({fill: '#A67400'})
		}
	})();

	// TODO: rivers
	(function() {
		var point = get_xy(7, 1)
		point[0] += 2.12 * map_constants.width
		point[1] += 0.75 * map_constants.width
		var start = 'M' + (point[0]) + ' ' + (point[1])
		var end = 'L' + (point[0]) + ' ' + (point[1] + map_constants.width)
		var river = paper.path(start + end)
		river.attr({stroke : 'red', 'stroke-width' : 5})
	})();

	return hexes;
}
