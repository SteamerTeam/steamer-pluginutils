"use strict";

const os = require('os'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  _ = require('lodash');


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
 */
pluginUtils.prototype.createConfig = function(folder, config, isJs, isForce) {

	var folder = folder || "",
		config = config || "",
		isJs = isJs || false,
		isForce = isForce || false;

	let fileExt = (isJs) ? "js" : "json",
		newConfig = {
			plugin: this.pluginName,
			config: config,
		},
		contentPrefix = (isJs) ? "module.exports = " : "",
		content = contentPrefix + JSON.stringify(newConfig, null, 4),
		configFile = path.resolve(path.join(folder, ".steamer/" + this.pluginName + "." + fileExt));

	if (!isForce && fs.existsSync(configFile)) {
		throw new Error(configFile +  " exists");
	}

	fs.ensureFileSync(configFile);
	fs.writeFileSync(configFile, content, 'utf-8');

	this.config = null;
};

/**
 * [read config file]
 * @param  {String}  folder [children folder relative to current folder]
 * @param  {Boolean} isJs [config file format json or js]
 * @return {Object}         [config object]
 */
pluginUtils.prototype.readConfig = function(folder, isJs) {
	var folder = folder || "",
		isJs = isJs || false;

	let fileExt = (isJs) ? "js" : "json",
		configFile = path.resolve(path.join(folder, ".steamer/" + this.pluginName + "." + fileExt));

	if (!fs.existsSync(configFile)) {
		throw new Error(configFile +  "not exists");
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


module.exports = pluginUtils;