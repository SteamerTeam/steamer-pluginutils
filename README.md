### steamer-pluginutils
utils for steamer plugin

#### Api

For usage details, you can take a look at test folder. 

- pluginName
	- String
	- Default: ""
	- register plugin name

- cacheMode
	- Boolean
	- Default: true
	- cache config or not

- config
	- Object
	- Default: null,
	- config cache

- createConfig
	- Function
	- create config
	- Parameters
		- `folder`, children folder relative to current folder, default: `""`
		- `config`, config object, default: `{}`
		- `isJs`, config file format json or js, default: `false`
		- `isForce`, is force to overwrite, default: `false`

- readConfig
	- Function
	- create config
	- Parameters
		- `folder`, children folder relative to current folder, default: `""`
 		- `isJs`, config file format json or js, default: `false`
 	- Return
 		- `config`, config object

