"use strict";

const pluginUtils = require('../index'),
	  path = require('path'),
	  os = require('os'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  expect = require('expect.js'),
	  sinon = require('sinon');

const TEMP = 'TEMP';

before(function() {
	process.chdir('./test');
	fs.ensureDirSync(TEMP);
});

after(function() {
	process.chdir('..');
	fs.removeSync(TEMP);
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
	    process.chdir(TEMP);
	    cwd = process.cwd();
	});

	// afterEach(function() {
	//     // this.sandbox.restore();
	// });

	it("createConfig without option", function() {
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
			test: 'test2json'
		}, {
			filename: "test2",
			extension: "json",
			overwrite: true,
		});

		var config = JSON.parse(fs.readFileSync(path.join(cwd, configFile), "utf-8"));

		expect(config).to.eql({
			plugin: 'test2',
			config: {
				test: 'test2json'
			}
		});
  	});

  	it("read local config without option", function() {
  		var utils = new pluginUtils("steamer-plugin-" + now);

		var config = utils.readConfig();

		expect(config).to.eql({ test: 'test' });
  	});

  	it("read local config with option", function() {
  		var utils = new pluginUtils("steamer-plugin-" + now);

		var config = utils.readConfig({
			filename: "test2",
			extension: "json",
		});

		expect(config).to.eql({ test: 'test2json' });
  	});

  	it("create and read global config", function() {
  		var sandbox = sinon.sandbox.create();

  		var utils = new pluginUtils("steamer-plugin-test3");

  		sandbox.stub(fs, "ensureFileSync", function() {
  			
  		});
  		sandbox.stub(fs, "writeFileSync", function() {
  			
  		});

  		var _readFile = sandbox.stub(utils, "_readFile");
  		_readFile.onCall(0).returns({test1: 'test1'});
  		_readFile.onCall(1).returns({test1: 'test', test2: 'test2'});

		utils.createConfig({
			test1: 'test',
			test2: 'test2'
		}, {
			isGlobal: true
		});

		var config = utils.readConfig({});

		expect(config).to.eql({test1: 'test', test2: 'test2'});

		sandbox.restore();
  	});

  	it("create and read steamer config", function() {
  		var sandbox = sinon.sandbox.create();

  		var utils = new pluginUtils("steamer-plugin-test3");

  		sandbox.stub(fs, "ensureFileSync", function() {
  			
  		});
  		sandbox.stub(fs, "writeFileSync", function() {
  			
  		});

  		var _readFile = sandbox.stub(utils, "_readFile");
  		_readFile.onCall(0).returns({test1: 'test1'});
  		_readFile.onCall(1).returns({test1: 'test', test2: 'test2'});

		utils.createSteamerConfig({
			test1: 'test',
			test2: 'test2'
		});

		var config = utils.readSteamerConfig({});

		expect(config).to.eql({test1: 'test', test2: 'test2'});

		sandbox.restore();
  	});

  	it("create config in existing file", function() {
  		var sandbox = sinon.sandbox.create();

  		var utils = new pluginUtils("steamer-plugin-test4");

  		sandbox.stub(fs, "ensureFileSync", function() {
  			
  		});
  		sandbox.stub(fs, "writeFileSync", function() {
  			
  		});
  		sandbox.stub(utils, "error"); // supress error log
  		
  		var existSync = sandbox.stub(fs, "existsSync");
  		existSync.withArgs(path.join(os.homedir(), ".steamer/steamer.js")).returns(true);

  		expect(function() {
			utils.createSteamerConfig({
				test1: 'test',
				test2: 'test2'
			}, {
				isGlobal: true
			});
		}).to.throwError();

		sandbox.restore();
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
  		utils.printTitle('test3', 'white');

		var str = " test3 ",
			len = str.length,
			maxLen = process.stdout.columns || 84;

		var padding = "=".repeat(Math.floor((maxLen - len) / 2));

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['white'](padding + str + padding))).to.be(true);
		log.restore();
  	});

  	it("printEnd", function() {
  		utils.printEnd('white');

  		var maxLen = process.stdout.columns || 84;

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(chalk['white']("=".repeat(maxLen)))).to.be(true);
		log.restore();
  	});

  	it("printUsage", function() {
  		var des = 123;

  		utils.printUsage(des);

  		var msg = chalk.green("\nusage: \n");
  		msg += "steamer test3    " + des + "\n";

		expect(console.log.calledOnce).to.be(true);
		expect(console.log.calledWith(msg)).to.be(true);
		log.restore();
  	});

  	it("printOption", function() {

  		utils.printOption([
			{
				option: "del",
				alias: "d",
				description: "delete file"
			},
			{
				option: "add",
				alias: "a",
				description: "add file"
			},
			{
				option: "config",
				alias: "c",
				description: "set config"
			},
			{
				option: "init",
				alias: "i",
				value: "<kit name>",
				description: "init starter kit name"
			},
			{
				option: "random",
				alias: "r",
				value: "<123123123123123123>",
				description: "123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123"
			},
		]);
  		
		expect(console.log.calledOnce).to.be(true);
		// expect(console.log.calledWith(msg)).to.be(true);
		log.restore();
  	});
});
