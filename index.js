"use strict";

const os = require('os'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  _ = require('lodash');


function pluginUtils(pluginName) {

	this.pluginPrefix = "steamer-plugin-";

	this.pluginName = pluginName || "";
	// plugin config object
	this.config = null;

	this.isWindows = (os.type() === "Windows_NT");

	// global home directory, usually for global config
	this.globalHome = this._getGlobalHome();

	// global node module path
	this.globalNodeModules = process.env.NODE_PATH || '';
}

/**
 * get home directory
 * @return {String} [os home directory]
 */
pluginUtils.prototype._getGlobalHome = function() {
	return os.homedir() || process.cwd();
};

/**
 * add nodejs require path
 * @param {String} requirePath [new require path]
 * @param {String} targetPath  [target require path]
 */
pluginUtils.prototype.addRequirePath = function(requirePath, targetPath) {
	var targetPath = targetPath || require.main.paths;

	if (!_.includes(targetPath, requirePath)) {
		targetPath.push(requirePath);
	}

};

/**
 * Create config file
 * @param  {Object} config [config object]
 * @param  {Object} option [options]
 */
pluginUtils.prototype.createConfig = function(config, option) {
	var config = config || "",
		option = option || {};

	// config file path: [folder]./steamer/[filename].[extension]
	var folder = (option.isGlobal) ? this.globalHome : (option.folder || process.cwd()),
		filename = option.filename || this.pluginName,
		extension = option.extension || "js",
		overwrite = option.overwrite || false; // overwrite the config file or not

	var configFile = path.resolve(path.join(folder, ".steamer/" + filename + "." + extension));

	if (!overwrite && fs.existsSync(configFile)) {
		throw new Error(configFile +  " exists");
	}

	this._writeFile(configFile, filename, config);
	
	this.config = null;
};

/**
 * read config file, local config extends global config
 * @param  {Object} config [config object]
 * @param  {Object} option [options]
 */
pluginUtils.prototype.readConfig = function(option) {
	var option = option || {};

	var folder = option.folder || process.cwd(),
		filename = option.filename || this.pluginName,
		extension = option.extension || "js";

	var globalConfigFile = path.resolve(path.join(this.globalHome, ".steamer/" + filename + "." + extension)),
		localConfigFile = path.resolve(path.join(folder, ".steamer/" + filename + "." + extension));

	var globalConfig = this._readFile(globalConfigFile),
		localConfig = this._readFile(localConfigFile);

	this.config = _.merge({}, globalConfig, localConfig);

	return this.config;
};

/**
 * read steamerjs config, local config extensd global config
 * @return {Object}           [steamer config]
 */
pluginUtils.prototype.readSteamerConfig = function() {

	var globalConfig = this.readSteamerLocalConfig(),
		localConfig = this.readSteamerGlobalConfig();

	var config = _.merge({}, globalConfig, localConfig);

	return config;
};

/**
 * read steamerjs local config
 * @return {Object} [steamer local config]
 */
pluginUtils.prototype.readSteamerLocalConfig = function() {
	
	var localConfigFile = path.join(process.cwd(), ".steamer/steamer.js");

	var localConfig = this._readFile(localConfigFile);

	return localConfig;
};

/**
 * read steamerjs global config
 * @return {Object} [steamer global config]
 */
pluginUtils.prototype.readSteamerGlobalConfig = function() {
	
	var globalConfigFile = path.join(this.globalHome, ".steamer/steamer.js");

	var globalConfig = this._readFile(globalConfigFile);

	return globalConfig;
};


/**
 * create steamerjs config
 */
pluginUtils.prototype.createSteamerConfig = function(config, options) {
	var config = config || {},
		options = options || {};

	var folder = (options.isGlobal) ? this.globalHome : process.cwd(),
		overwrite = options.overwrite || false;

	var configFile = path.join(folder, ".steamer/steamer.js");

	try {
		if (!overwrite && fs.existsSync(configFile)) {
			throw new Error(configFile +  " exists");
		}

		this._writeFile(configFile, "steamerjs", config);
		
	}
	catch(e) {
		this.error(e.stack);
		throw e;
	}
};


/**
 * read config file
 * @param  {String} filepath  [file path]
 * @return {Object}           [config object]
 */
pluginUtils.prototype._readFile = function(filepath) {

	var extension = path.extname(filepath);

	var isJs = extension === ".js",
		config = {};

	try {
		if (isJs) {
			config = require(filepath) || {};
		}
		else {
			config = JSON.parse(fs.readFileSync(filepath, "utf-8")) || {};
		}

		config = config.config;

	}
	catch(e) {
		return config;
	}

	return config;

};

/**
 * write config file
 * @param  {String} filepath [config file path]
 * @param  {Object|String}          [config content]
 */
pluginUtils.prototype._writeFile = function(filepath, plugin, config) {

	var extension = path.extname(filepath);
	var isJs = extension === ".js",
		newConfig = {
			plugin: plugin,
			config: config,
		},
		contentPrefix = (isJs) ? "module.exports = " : "",
		contentPostfix = (isJs) ? ";" : "",
		content = contentPrefix + JSON.stringify(newConfig, null, 4) + contentPostfix;

	try {
		fs.ensureFileSync(filepath);
		fs.writeFileSync(filepath, content, 'utf-8');
	}
	catch(e) {
		throw e;
	}
};

/**
 * print error message
 * @param  {String} str [message]
 * @return {String}     [msg]
 */
pluginUtils.prototype.error = function(str) {
	this.log(str, 'red');
};

/**
 * print information
 * @param  {String} str [message]
 * @return {String}     [msg]
 */
pluginUtils.prototype.info = function(str) {
	this.log(str, 'cyan');
};

/**
 * print warning message
 * @param  {String} str [message]
 * @return {String}     [msg]
 */
pluginUtils.prototype.warn = function(str) {
	this.log(str, 'yellow');
};

/**
 * print success message
 * @param  {String} str [message]
 * @return {String}     [msg]
 */
pluginUtils.prototype.success = function(str) {
	this.log(str, 'green');
};


/**
 * print title message
 * @param  {String} color [color name]
 * @return {String}       [msg with color]
 */
pluginUtils.prototype.printTitle = function(str, color) {
	var msg = "",
		color = color || 'white',
		str = " " + str + " ",
		len = str.length,
		maxLen = process.stdout.columns || 84;

	var padding = "=".repeat(Math.floor((maxLen - len) / 2));

	msg += padding + str + padding;

	return this.log(msg, color);
};

/**
 * print end message
 * @param  {String} color [color name]
 * @return {String}       [msg with color]
 */
pluginUtils.prototype.printEnd = function(color) {
	var msg = "",
		color = color || 'white',
		maxLen = process.stdout.columns || 84;

	msg += "=".repeat(maxLen);

	return this.log(msg, color);
};

/**
 * print command usage
 * @param  {String} description [description of the command]
 * @param  {String} cmd         [command name]
 * @return {String}             [message]
 */
pluginUtils.prototype.printUsage = function(description, cmd) {
	var msg = chalk.green("\nusage: \n"),
		cmd = cmd || this.pluginName.replace(this.pluginPrefix, "");

	msg += "steamer " + cmd + "    " + description + "\n";
	console.log(msg);
};

/**
 * print command option
 * @param  {Array} options  [array of options]
 	- option  		{String}    full option
 	- alias   		{String}    option alias
 	- value   		{String}    option alias
 	- description  	{String}    option description
 * @return {String}         [message]
 */
pluginUtils.prototype.printOption = function(options) {

	var options = options || [];

	var maxColumns = process.stdout.columns || 84,
		maxOptionLength = 0;

	var msg = chalk.green("options: \n");

	options.map((item) => {
		let option = item.option || '',
			alias = item.alias || '',
			value = item.value || ''; 

		let msg = "    --" + option;
		msg  += (alias) ? ", -" + alias : "";
		msg += (value) ?  " " + value : "";

		item.msg = msg;
		
		let msgLen = msg.length;

		maxOptionLength = (msgLen > maxOptionLength) ? msgLen : maxOptionLength;

		return item;
	});

	options.map((item) => {
		let length = item.msg.length;

		let space = " ".repeat(maxOptionLength - length);

		item.msg = item.msg + space + "    ";

		return item;

	});

	options.map((item) => {

		item.msg += item.description + "\n";

		msg += item.msg;

	});

	console.log(msg);
};

/**
 * pring message
 * @param  {String} str   [message]
 * @param  {String} color [color name]
 * @return {String}       [message with color]
 */
pluginUtils.prototype.log = function(str, color) {
	str = str || '';
	str = _.isObject(str) ? JSON.stringify(str) : str;
	let msg = chalk[color](str);
	console.log(msg);
	return msg;
};

module.exports = pluginUtils;