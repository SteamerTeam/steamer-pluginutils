# 1.3.0
    - no longer use npm root -g to fix issue if NODE_PATH is not set

## 1.2.12
	- improve how to get globalNodeModules

## 1.2.11
	- expose fs and chalk

## 1.2.10
	- try to fix spawn hang in windows

## 1.2.6
	- fix require cache issue
	- try to boost perf by wrapping `npm root -g` in a function

## 1.2.4
	- compatible with window shell

## 1.2.2
	- run `npm root -g` for `globalNodeModules`

## 1.2.0
	- restructure api and change test cases