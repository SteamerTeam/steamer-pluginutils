"use strict";

const pluginUtils = require('../index'),
	  path = require('path'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  expect = require('expect.js'),
	  sinon = require('sinon');

const TEST_TEMP = 'TEST_TEMP';

before(function() {
	process.chdir('./test');
	fs.ensureDirSync(TEST_TEMP);
});

after(function() {
	process.chdir('..');
	fs.removeSync(TEST_TEMP);
});

describe("addRequirePath", function() {
	it("test require success", function() {

		var utils = new pluginUtils(),
			requrePath = path.resolve();
		utils.addRequirePath(requrePath);

    	expect(require.main.paths).to.contain(requrePath);
  	});
});


describe("createConfig & readConfig:", function() {

	var now = Date.now(),
		cwd = '';

	before(function() {
	    process.chdir(TEST_TEMP);
	    cwd = process.cwd();
	});

	// afterEach(function() {
	//     // this.sandbox.restore();
	// });

	it("createConfig without config", function() {
		var utils = new pluginUtils("steamer-plugin-" + now);

		utils.createConfig({
			test: 'test'
		});

		var config = require(path.join(cwd, '.steamer/steamer-plugin-' + now));

    	expect(config).to.eql({
    		plugin: 'steamer-plugin-' + now,
  			config: { test: 'test' }
    	});
  	});

	it("createConfig config in existing file", function() {
		var utils = new pluginUtils("steamer-plugin-test1");

		fs.ensureFileSync('.steamer/steamer-plugin-test1.js');

		expect(function() {
			utils.createConfig({
				test: 'test'
			});
		}).to.throwError();
  	});

  	it("createConfig config with option", function() {
  		var utils = new pluginUtils("test2");

  		var configFile = '.steamer/test2.json';
		fs.ensureFileSync(configFile);

		utils.createConfig({
			test: 'test'
		}, {
			filename: "test2",
			extension: "json",
			overwrite: true,
		});

		var config = JSON.parse(fs.readFileSync(path.join(cwd, configFile), "utf-8"));

		expect(config).to.eql({
			plugin: 'test2',
			config: {
				test: 'test'
			}
		});
  	});

});

describe("print message:", function() {
	var spyLog, spyError, log,
		utils = new pluginUtils("steamer-plugin-test3");

	beforeEach(function() {
		log = sinon.stub(console, 'log');
	});

	afterEach(function() {
		// log.restore();
	});

	it("error", function() {
		utils.error('error');

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['red']('error'))).to.be(true);
		log.restore();
  	});

  	it("info", function() {
		utils.info('info');

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['cyan']('info'))).to.be(true);
		log.restore();
  	});

  	it("warn", function() {
		utils.warn('warn');

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['yellow']('warn'))).to.be(true);
		log.restore();
  	});

  	it("success", function() {
		utils.success('success');

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['green']('success'))).to.be(true);
		log.restore();
  	});

  	it("printTitle", function() {
  		utils.printTitle('cmd', 'white');

		var str = " cmd ",
			len = str.length,
			maxLen = process.stdout.columns;

		var padding = "=".repeat(Math.floor((maxLen - len) / 2));

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['white'](padding + str + padding))).to.be(true);
		log.restore();
  	});

  	it("printEnd", function() {
  		utils.printEnd('white');

  		var maxLen = process.stdout.columns;

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['white']("=".repeat(maxLen)))).to.be(true);
		log.restore();
  	});
});
