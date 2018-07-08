var logEnabled = true;
var resourceName = 'rapidtestdeployment';
var logFile = 'server.log';
var cache = '';
var header = '/* Rapid Test Deployment server.log */\r\n';
var cachePrefx ='';

var overwriteFile = function(s, file, target) {
	if (!SaveResourceFile(resourceName, file, s, s.length)){ 
		logEnabled = false;
		TriggerClientEvent('rtd:loggingDisabled', target);
		console.error(String.prototype.concat('RTD unable to write to ', file));
		return false;
	}
	return true;
}

onNet('rtd:firstSpawn', function(){
	logEnabled = true;
	cache = '';
	cachePrefix = header;
	overwriteFile(header, logFile, source);
});

onNet('rtd:writeLog', function() {
	if (logEnabled && cache.length > 0) {
		try {
			cachePrefix = LoadResourceFile(resourceName, logFile);
		}
		catch (ex) {
			console.error(String.concat('RTD error reading file: ', ex.toString()));
			cachePrefix = header;
			return;
		}
		cache = String.prototype.concat(cachePrefix, cache);
		if(overwriteFile(cache, logFile, source)) {
			cache = '';
		}
	}
});

onNet('rtd:log', function(s) {
	if (logEnabled) {
		cache = String.prototype.concat(cache, s, '\r\n');
	}
});