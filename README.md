## steamer-pluginutils

[steamerjs](https://github.com/SteamerTeam/steamerjs) 便于开发 `plugin` 的 `util` 函数

### 接口

#### 属性
- `pluginName`
	- `String`
	- 默认值: ""
	- 注册 `plugin` 名

- `config`
	- `Object`
	- 默认值: null,
	- 配置值

- `isWindows`
	- `Boolean`
	- 是否window系统
- `globalHome`
	- `String`
	- 通常用作全局配置存放的位置，是 `os.homedir()` 的一层包装

- `globalNodeModules`
	- `String`
	- 全局 `npm` 模块包位置， 是 `process.env.NODE_PATH` 的一层包装

#### 配置函数

- `addRequirePath`
	- `Function`
	- 添加模块搜索路径
	- 参数
	- `requirePath`, `String`, 新的模块搜索路径
	- `targetPath`, `String`, 添加新模块搜索路径的目标, 默认值: `require.main.paths`

- `createConfig`
	- Function
	- 创建配置
	- 参数
		- `config`, config object, 默认值为: `{}`
		- `option`, 其它配置项目
			- `isGlobal`,`Boolean`， 是否放于全局
			- `folder`, `String`, `.steamer` 的父目录，
			- `filename`, `String`, 具体的文件名
			- `extension`, `String`, 文件名后缀，默认值：`js`
			- `overwrite`, `Boolean`, 是否覆盖已经存在的配置文件


- `readConfig`
	- Function
	- 读取配置, 采用配置继承的方式，本地配置继承全局配置
	- 参数
		- `option`, 其它配置项目
			- `folder`, `String`, `.steamer` 的父目录，
			- `filename`, `String`, 具体的文件名
			- `extension`, `String`, 文件名后缀，默认值：`js`

- readSteamerConfig
	- Function
	- read steamerjs global or local config
	- Parameters
		- `isGlobal`, is the config global or local, default: `false`
	- Return 
		- `config`, config object

- createSteamerConfig
	- Function
	- read steamerjs global or local config
	- Parameters
		- `isGlobal`, is the config global or local, default: `false`
	- Return 
		- `config`, config object

#### 命令输出

- error
	- Function
	- 将文本以红色输出

- info
	- Function
	- 将文本以蓝色输出

- warn
	- Function
	- 将文本以黄色输出

- success
	- Function
	- 将文本以绿色输出

- printTitle
 	- Function
 	- 输出命令标题
 	- Parameters
 		- `str`, 标题
 		- `color`, 颜色
```
// 例子
================================ Command Usage ================================
```

- printEnd
 	- Function
 	- 输出命令结尾
 	- Parameters
 		- `color`, 颜色
```
// 例子
================================================================================
```

- printUsage
 	- Function
 	- 输出命令使用
 	- Parameters
 		- `description`, 命令描述
 		- `cmd`, 命令名称
 ```
 // 例子
usage:
steamer doctor    help you check steamer running environment!!!
 ```

 - printOption
	 - Function
	 	- 输出命令参数
	 	- Parameters
	 		- `options`, 参数数组
	 			- `option.option`, 参数名
	 			- `option.alias`, 参数别名
	 			- `option.value`, 参数值
```
// 例子
options:
    --help, -h                    123
    --ak, -a                      456
    --plugin, -p <plugin name>    789
    --help                        123
```



### 开发及测试
```
// 用于全局进行代码清理
npm i -g eslint
npm run lint

// 用于测试
npm test
```