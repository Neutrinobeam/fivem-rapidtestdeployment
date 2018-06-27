var chatColor = [112, 112, 255];

/*
TODO: Figure out how to do this on first spawn / player join
on('playerSpawned', function () {
	emit('chatMessage', 'RTD', chatColor, 'Rapid Test Deployment loaded.');
});
*/

RegisterCommand('rtd', function(source, args) {
	if (args.length > 0) {
		parseInput(args.join(' '));
	}
	else {
		ShowInput(true);
	}
}, false);

emit('chat:addSuggestion', '/rtd', 'Use without arguments to start the RTD function editor.');

var ShowInput = function(visible) {
	SetPlayerControl(PlayerId(), visible ? 0 : 1, 0);
	SetNuiFocus(visible, visible);
	SendNuiMessage(JSON.stringify({"type" : 'gui', "visible" : visible}));
}

RegisterNuiCallbackType('response');
on('__cfx_nui:response', function(data, cb){
	ShowInput(false);
	if (data.isValid) {
		parseInput(data.text);
	}
	else {
		emit('chatMessage', 'RTD', chatColor, 'Function input cancelled.');
	}
	cb('ok');
});

var resetControls = function() {
	SetPlayerControl(PlayerId(), 1, 0);
};

var alert = function(s) {
	SetNotificationTextEntry('STRING');
	AddTextComponentSubstringPlayerName(s);
	DrawNotification(false, false);
};

this.text = '';

var parseInput = function(s) {
	this.text = s;
	try {
		var f = new Function(this.text);
		var r = f();
		if (typeof r != 'undefined') {
			alert(r.toString());
		}
	}
	catch (ex) {
		emit('chatMessage', 'RTD', chatColor, ex.toString());
		return;
	}
	emit('chatMessage', 'RTD', chatColor, this.text);
}
