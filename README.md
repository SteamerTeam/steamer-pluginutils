## steamer-pluginutils
utils for steamerjs plugin

### Api

For usage details, you can take a look at test folder. 

- pluginName
	- String
	- Default: ""
	- register plugin name

- config
	- Object
	- Default: null,
	- config

- isWindows
	- Boolean
	- whether the os system is windows or not

- globalNodeModules
	- String
	- global node module path based on os system, a wrapper for `process.env.NODE_PATH`

- addRequirePath
	- Function
	- add require search path
	- Parameters
	- `requirePath`, new search path you wanna add
	- `targetPath`, target path you wanna add into, default: `require.main.paths`

- createConfig
	- Function
	- create config
	- Parameters
		- `folder`, children folder relative to current folder, default: `""`
		- `config`, config object, default: `{}`
		- `isJs`, config file format json or js, default: `false`
		- `isForce`, is force to overwrite, default: `false`
		- `targetName`, target file name, default will the the value of `this.pluginName`

- readConfig
	- Function
	- create config
	- Parameters
		- `folder`, children folder relative to current folder, default: `""`
 		- `isJs`, config file format json or js, default: `false`
 		- `targetName`, target file name, default will the the value of `this.pluginName`
 	- Return
 		- `config`, config object

- readSteamerConfig
	- Function
	- read steamerjs global or local config
	- Parameters
		- `isGlobal`, is the config global or local, default: `false`
	- Return 
		- `config`, config object

- readPkgJson
	- Function
	- read package.json
	- Parameters
		- `pkgjson`, path of the package.json
	- Return 
		- `config`, content

- writePkgJson
	- Function
	- read package.json
	- Parameters
		- `pkgjson`, path of the package.json
		- `content`

- error
	- Function
	- print message in red

- info
	- Function
	- print message in cyan

- warn
	- Function
	- print message in yellow

- success
	- Function
	- print message in green


### For Development
```
// for correct the code format
npm i -g eslint

npm run lint

// for testing
npm i -g jasmine

npm test
```

## Changelog
* v1.0.5 change globalNodeModules path