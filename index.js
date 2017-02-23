"use strict";

const os = require('os'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  _ = require('lodash');


function pluginUtils(pluginName) {
	this.pluginName = pluginName || "";
	this.cacheMode = false;
	this.config = null; // cache config

	this.isWindows = (os.type() === "Windows_NT");
	this.globalNodeModules = path.join(process.env.NODE_PATH);
}

pluginUtils.prototype.addRequirePath = function(requirePath, targetPath) {
	var targetPath = targetPath || require.main.paths;
	targetPath.push(requirePath);
};

/**
 * [Create config file]
 * @param  {String}  folder  [children folder relative to current folder]
 * @param  {Object}  config  [config object]
 * @param  {Boolean} isJs  [config file format json or js]
 * @param  {Boolean} isForce [is force to overwrite]
 * @param  {String}  targetName  [target file name]
 */
pluginUtils.prototype.createConfig = function(folder, config, isJs, isForce, targetName) {

	var folder = folder || "",
		config = config || "",
		isJs = isJs || false,
		isForce = isForce || false,
		targetName = targetName || this.pluginName;

	let fileExt = (isJs) ? "js" : "json",
		newConfig = {
			plugin: targetName,
			config: config,
		},
		contentPrefix = (isJs) ? "module.exports = " : "",
		content = contentPrefix + JSON.stringify(newConfig, null, 4),
		configFile = path.resolve(path.join(folder, ".steamer/" + targetName + "." + fileExt));

	try {
		if (!isForce && fs.existsSync(configFile)) {
			throw new Error(configFile +  " exists");
		}

		fs.ensureFileSync(configFile);
		fs.writeFileSync(configFile, content, 'utf-8');
	}
	catch(e) {
		this.error(e.stack);
	}

	this.config = null;
};

/**
 * [read config file]
 * @param  {String}  folder [children folder relative to current folder]
 * @param  {Boolean} isJs [config file format json or js]
 * @param  {String}  targetName  [target file name]
 * @return {Object}         [config object]
 */
pluginUtils.prototype.readConfig = function(folder, isJs, targetName) {
	var folder = folder || "",
		isJs = isJs || false,
		targetName = targetName || this.pluginName;

	let fileExt = (isJs) ? "js" : "json",
		configFile = path.resolve(path.join(folder, ".steamer/" + targetName + "." + fileExt));

	if (!fs.existsSync(configFile)) {
		return this.config;
	}

	if (this.config && this.cacheMode) {
		return this.config;
	}

	try {
		if (isJs) {
			let config = require(configFile) || {};
			this.config = config.config;
		}
		else {
			let config = JSON.parse(fs.readFileSync(configFile, "utf-8")) || {};
			this.config = config.config;
		}

		return this.config;
	}
	catch(e) {
		this.error(e.stack);
	}
};

/**
 * [read steamerjs global / local config]
 * @param  {Boolean} isGlobal [is the config global or local]
 * @return {Object}           [steamer config]
 */
pluginUtils.prototype.readSteamerConfig = function(isGlobal) {
	var isGlobal = isGlobal || false,
		configFileName = ".steamer/steamer.js",
		configFile = isGlobal ? path.join(this.globalNodeModules, "steamerjs", configFileName) : path.resolve(configFileName);


	if (!fs.existsSync(configFile)) {
		return {};
	}

	try {
		let config = require(configFile) || {};
		return config.config;
	}
	catch(e) {
		this.error(e.stack);
	}

	return {};
	
};

/**
 * [read package.json]
 * @param  {String} pkgjson [path of the package.json]
 * @return {Object}         [content]
 */
pluginUtils.prototype.readPkgJson = function(pkgjson) {
	var config = null;

	try {
		config = JSON.parse(fs.readFileSync(pkgjson, "utf-8")) || {};
	}
	catch(e) {
		this.error(e.stack);
	}

	return config;
};

/**
 * [write package.json]
 * @param  {String} pkgjson [path of the package.json]
 * @param  {Object} content
 */
pluginUtils.prototype.writePkgJson = function(pkgjson, content) {
	try {
		content = JSON.stringify(content, null, 4);

		fs.ensureFileSync(pkgjson);
		fs.writeFileSync(pkgjson, content, 'utf-8');
	}
	catch(e) {
		this.error(e.stack);
	}
};

pluginUtils.prototype.error = function(str) {
	return this._printMessage(str, 'red');
};

pluginUtils.prototype.info = function(str) {
	return this._printMessage(str, 'cyan');
};

pluginUtils.prototype.warn = function(str) {
	return this._printMessage(str, 'yellow');
};

pluginUtils.prototype.success = function(str) {
	return this._printMessage(str, 'green');
};

pluginUtils.prototype._printMessage = function(str, color) {
	str = str || '';
	str = _.isObject(str) ? JSON.stringify(str) : str;
	let msg = chalk[color](str);
	console.log(msg);
	return msg;
};

module.exports = pluginUtils;