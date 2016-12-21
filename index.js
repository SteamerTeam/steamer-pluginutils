"use strict";

const os = require('os'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  _ = require('lodash'),
	  colors = require('colors');


function pluginUtils() {
	this.pluginName = "";
	this.cacheMode = true;
	this.config = null; // cache config

	this.isWindows = (os.type() === "Windows_NT");

	this.globalNodeModules = this.isWindows ? 
	  				  path.join(process.config.variables.node_prefix + "/node_modules")
	  				: path.join(process.config.variables.node_prefix + "/lib/node_modules");
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

	if (!isForce && fs.existsSync(configFile)) {
		throw new Error(configFile +  " exists");
	}

	fs.ensureFileSync(configFile);
	fs.writeFileSync(configFile, content, 'utf-8');

	this.success(configFile + " is created");

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
		throw new Error(configFile +  " not exists");
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
		console.log(e.stack);
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
		throw new Error(configFile +  " not exists");
	}

	try {
		let config = require(configFile) || {};
		return config.config
	}
	catch(e) {
		console.log(e.stack);
	}

	return {};
	
};

pluginUtils.prototype.error = function(str) {
	console.log(str['red']);
};

pluginUtils.prototype.info = function(str) {
	console.log(str['cyan']);
};

pluginUtils.prototype.warn = function(str) {
	console.log(str['yellow']);
};

pluginUtils.prototype.success = function(str) {
	console.log(str['green']);
};

module.exports = pluginUtils;