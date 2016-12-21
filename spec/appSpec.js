"use strict";

const pluginUtils = require('../index'),
	  path = require('path'),
	  fs = require('fs-extra');

fs.removeSync("./spec/test/");

const testFolder = "./spec/test/",
	  resultFolder = "./spec/result/";

describe("addRequirePath test1", function() {
	it("test require success", function() {

		var utils = new pluginUtils(),
			requrePath = path.resolve();
		utils.addRequirePath(requrePath);

    	expect(require.main.paths).toContain(requrePath);
  	});
});

describe("createConfig test1", function() {
	it("test folder param and isForce param", function() {

		var utils = new pluginUtils();
			utils.pluginName = "steamer-plugin-test1";

		var isJs = true,
			isForce = false;

		var config = {
			"test": "test"
		};

		utils.createConfig(testFolder, config, isJs, isForce);

		var conf = require("./test/.steamer/" + "steamer-plugin-test1"),
			resultConf = require('./result/.steamer/steamer-plugin-test1');

		
    	expect(JSON.stringify(conf)).toEqual(JSON.stringify(resultConf));
  	});
});

describe("createConfig test1", function() {
	it("test isJs param and targetName", function() {

		var utils = new pluginUtils();
			utils.pluginName = "steamer-plugin-test1";

		var isJs = false,
			isForce = false,
			targetName = "steamer-plugin-targetName";

		var config = {
			"test": "test"
		};

		utils.createConfig(testFolder, config, isJs, isForce, targetName);

		var conf = JSON.parse(fs.readFileSync(path.resolve(testFolder + "/.steamer/" + targetName + ".json"), "utf-8")),
			resultConf = JSON.parse(fs.readFileSync(path.resolve(resultFolder + "/.steamer/" + targetName + ".json"), "utf-8"));

		expect(JSON.stringify(conf)).toEqual(JSON.stringify(resultConf));
  	});
});

describe("readConfig test1", function() {
	it("test folder param and isJs", function() {

		var utils = new pluginUtils();
			utils.pluginName = "steamer-plugin-test1";

		var isJs = true;

		var conf = utils.readConfig(testFolder, isJs),
			resultConf = utils.readConfig(resultFolder, isJs);

    	expect(JSON.stringify(conf)).toEqual(JSON.stringify(resultConf));
  	});
});

describe("readConfig test2", function() {
	it("test targetName param", function() {

		var utils = new pluginUtils();
			utils.pluginName = "steamer-plugin-test1";
		
		var targetName = "steamer-plugin-targetName";

		var isJs = false;

		var conf = utils.readConfig(testFolder, isJs, targetName),
			resultConf = utils.readConfig(resultFolder, isJs, targetName);

    	expect(JSON.stringify(conf)).toEqual(JSON.stringify(resultConf));
  	});
});

describe("readSteamerConfig test1", function() {
	it("test read local steamer config", function() {

		var utils = new pluginUtils();
			utils.pluginName = "steamer";

		var config = {
	        "http-proxy": "123",
	        "https-proxy": ""
	    };

	    var isJs = true,
	    	isForce = true,
	    	targetName = "steamer";

		utils.createConfig(testFolder, config, isJs, isForce, targetName);
		
		process.chdir(testFolder);

		var conf = utils.readSteamerConfig(),
			resultConf = utils.readConfig("", isJs, targetName);

    	expect(JSON.stringify(conf)).toEqual(JSON.stringify(resultConf));
  	});
});