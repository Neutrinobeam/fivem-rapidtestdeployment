$(document).ready(function(){
	window.addEventListener('message', function(event){
		if (event.data.type == "gui") {
			document.body.style.display = event.data.visible ? 'block' : 'none';
		}
	});
	
	$('#cancelBtn').click(function(event){
		$.post('http://rapidtestdeployment/response', JSON.stringify({"isValid" : false}));
	});
	
	$('#confirmBtn').click(function(event){
		$.post('http://rapidtestdeployment/response', JSON.stringify({"isValid" : true, "text" : $('#codeArea').val()}));
	});

	$(document).keyup(function(event){
		if (event.key == 'Escape') {
			$.post('http://rapidtestdeployment/response', JSON.stringify({"isValid" : false}));
		}
	});
	
	$(document).keydown(function(event){
		if (event.shiftKey && event.key == 'Enter') {
			event.preventDefault();
			$.post('http://rapidtestdeployment/response', JSON.stringify({"isValid" : true, "text" : $('#codeArea').val()}));
		}
	});

	var setContentDisplay = function(text) {
		$('#fileArea').val(text);
	};

	var foundIndex = -1;
	
	$('#fileElement').change(function(event){
		foundIndex = -1;
		if (event.target.files.length < 1) {
			setContentDisplay('No file selected.');
			return;
		}
		var file = event.target.files[0];
		var fr = new FileReader();
		fr.onload = function(e) {
			setContentDisplay(e.target.result);
		}
		fr.onloadstart = function(e) {
			setContentDisplay('Loading...');
		}
		fr.onerror = function(e) {
			setContentDisplay(String.concat('Error: ', this.error.message));
		}
		fr.readAsText(file);
	});
	
	var scrollToFound = function(f, offset, forward) {
		var m = $('#mirror')[0];
		m.value = f.val().substr(0, offset);
		var h1 = parseInt(f.css('height').replace('px',''));
		var textHeight = parseInt(f.css('font-size').replace('px',''));
		var h2 = m.scrollHeight;
		var pos = f[0].scrollTop;
		if (forward && h2 >= pos + h1) {
			f[0].scrollTop = h2 - h1;
		}
		else if (!forward && h2 < pos + textHeight) {
			var whiteSpace = parseInt(f.css('border-top-width').replace('px',''));
			whiteSpace += parseInt(f.css('border-bottom-width').replace('px',''));
			whiteSpace += parseInt(f.css('padding-top').replace('px',''));
			whiteSpace += parseInt(f.css('padding-bottom').replace('px',''));
			f[0].scrollTop = h2 - textHeight - whiteSpace;
		}
	}
			
	var searchInViewer = function(isForward) {
		var searchStr = $('#searchBox').val();
		var field = $('#fileArea');
		var lastAt = foundIndex;
		if (isForward) {
			foundIndex = field.val().indexOf(searchStr, lastAt + 1);
		}
		else if (lastAt > -1) {
			foundIndex = field.val().lastIndexOf(searchStr, lastAt - 1);
		}
		else {
			foundIndex = field.val().lastIndexOf(searchStr);
		}
		if (foundIndex > -1) {
			field.focus();
			scrollToFound(field, foundIndex, isForward);
			field = field[0];
			if (field.setSelectionRange) {
				field.setSelectionRange(foundIndex, foundIndex + searchStr.length);
			}
		}
		else {
			window.getSelection().collapseToStart();
		}
	};
	
	$('#findNextBtn').click(function(event){
		searchInViewer(true);
	});
	
	$('#findLastBtn').click(function(event){
		searchInViewer(false);
	});
});