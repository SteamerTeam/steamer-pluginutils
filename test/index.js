"use strict";

const pluginUtils = require('../index');


// test1
{
	let utils = new pluginUtils();
	utils.pluginName = "steamer-plugin-test1";

	let folder = "test",
		config = {
		    "kit": "steamer-react",
		    "mapping": {
		        "webserver": "//huayang.qq.com/huayang/activity/",
		        "cdn": "//s1.url.cn/huayang/",
		        "port": 9000,
		        "route": "/"
		    }
		},
		isJs = false,
		isForce = true;

	utils.createConfig(folder, config, isJs, isForce);
}

// test2
{
	let utils = new pluginUtils();
	utils.pluginName = "steamer-plugin-test2";

	let folder = "test",
		config = {
		    "kit": "steamer-react",
		    "mapping": {
		        "webserver": "//huayang.qq.com/huayang/activity/",
		        "cdn": "//s1.url.cn/huayang/",
		        "port": 9000,
		        "route": "/"
		    }
		},
		isJs = true,
		isForce = true;

	utils.createConfig(folder, config, isJs, isForce);
}

// test3
{
	let utils = new pluginUtils();
	utils.pluginName = "steamer-plugin-test2";

	let folder = "test",
		isJs = true;

	let config = utils.readConfig(folder, isJs);
	console.log(config);
}

// test4
{
	let utils = new pluginUtils();
	utils.pluginName = "steamer-plugin-test1";

	let folder = "test",
		isJs = false;

	let config = utils.readConfig(folder, isJs);
	console.log(config);
}

// test5
{
	let utils = new pluginUtils();
	utils.pluginName = "steamer-plugin-test2";

	let folder = "test",
		config = {},
		isJs = true,
		isForce = false;

	utils.createConfig(folder, config, isJs, isForce);
}