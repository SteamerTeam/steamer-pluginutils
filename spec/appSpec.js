"use strict";

const pluginUtils = require('../index'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  chalk = require('chalk');

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

describe("read and write package.json", function() {
	it("about package.json", function() {
		var utils = new pluginUtils();

		var config = utils.readPkgJson(path.resolve("../result/source.json"));

		config.version = "1.5.0";

		utils.writePkgJson(path.resolve("../result/target.json"), config);	
		
		var resultConfig = utils.readPkgJson(path.resolve("../result/result.json"));

		var targetConfig = 	utils.readPkgJson(path.resolve("../result/target.json"));

		expect(JSON.stringify(resultConfig)).toEqual(JSON.stringify(targetConfig));
  	});
});

describe("test message print", function() {

	var utils = new pluginUtils(),
		v1, v2, v3, v4;

	beforeEach(function() {

	    spyOn(utils, 'error').and.returnValue('error');
	    spyOn(utils, 'info').and.returnValue('info');
	    spyOn(utils, 'warn').and.returnValue('warn');
	    spyOn(utils, 'success').and.returnValue('success');

	    v1 = utils.error('error');
	    v2 = utils.info('info');
	    v3 = utils.warn('warn');
	    v4 = utils.success('success');
	});

	it("tracks that the print spy was called", function() {
	    expect(utils.error).toHaveBeenCalled();
	    expect(utils.info).toHaveBeenCalled();
	    expect(utils.warn).toHaveBeenCalled();
	    expect(utils.success).toHaveBeenCalled();
	});

	it("tracks all the arguments of print calls", function() {
	    expect(utils.error).toHaveBeenCalledWith('error');
	    expect(utils.info).toHaveBeenCalledWith('info');
	    expect(utils.warn).toHaveBeenCalledWith('warn');
	    expect(utils.success).toHaveBeenCalledWith('success');
	});

	it("tracks that the print spy return", function() {
	    expect(v1).toEqual('error');
	    expect(v2).toEqual('info');
	    expect(v3).toEqual('warn');
	    expect(v4).toEqual('success');
	});

});

describe("test message print without spy", function() {

	var utils = new pluginUtils();

	it("tracks that the print spy return", function() {
		console.log('\n');
	    expect(utils.error('error')).toEqual(chalk.red('error'));
	    expect(utils.info('info')).toEqual(chalk.cyan('info'));
	    expect(utils.warn('warn')).toEqual(chalk.yellow('warn'));
	    expect(utils.success('success')).toEqual(chalk.green('success'));
	    expect(utils.error({error: 'error'})).toEqual(chalk.red(JSON.stringify({error: 'error'})));
	    expect(utils.error(null)).toEqual(chalk.red(''));
	});
});

