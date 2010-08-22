// vim:ts=8 sw=8 noet

jQuery(document).ready(function() {
	var paper = Raphael(0, 0, 2000, 1000);
	hexes = build_map(paper, false)

	alert('go');
	jQuery('#y5x9').each(function(index, element) {
		alert(index)
	})
})
