jQuery(document).ready(function(){
	jQuery('input:submit').button()
	jQuery('input:checkbox').button()

	// hijack the browser alert with pnotify
	if (_alert) return;
	var _alert = window.alert;
	window.alert = function(message) {
		jQuery.pnotify({
			pnotify_title: 'Alert',
			pnotify_text: message
		});
	}
});
