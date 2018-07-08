var chatColor = [112, 112, 255];
var initialSpawn = true;
var logEnabled = true;

on('playerSpawned', function () {
	if (initialSpawn) {
		initialSpawn = false;
		emit('chatMessage', 'RTD', chatColor, 'Rapid Test Deployment loaded.');
		emitNet('rtd:firstSpawn');
	}
});

RegisterCommand('rtd', function(source, args) {
	if (args.length > 0) {
		parseInput(args.join(' '));
		confirmLog();
	}
	else {
		ShowInput(true);
	}
}, false);

emit('chat:addSuggestion', '/rtd', 'Use without arguments to start the RTD function editor.');

onNet('rtd:loggingDisabled', function() {
	emit('chatMessage', 'RTD', chatcolor, 'Unable to access log file (aerver.log). Disabling logging.');
	logEnabled = false;
	CancelEvent();
});

var ShowInput = function(visible) {
	SetPlayerControl(PlayerId(), visible ? 0 : 1, 0);
	SetNuiFocus(visible, visible);
	SendNuiMessage(JSON.stringify({"type" : 'gui', "visible" : visible}));
}

RegisterNuiCallbackType('rtd:uiResponse');
on('__cfx_nui:rtd:uiResponse', function(data, cb){
	ShowInput(false);
	if (data.isValid) {
		parseInput(data.text);
	}
	else {
		emit('chatMessage', 'RTD', chatColor, 'Function input cancelled.');
	}
	confirmLog();
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

var log = function(s) {
	if (logEnabled) {
		emitNet('rtd:log', s);
	}
};

var confirmLog = function() {
	if (logEnabled) {
		emitNet('rtd:writeLog');
	}
};
