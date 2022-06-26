# Dot Log

A vscode extension that uses **.log** to log params to the console.

## Download

Search [Dot Log](https://marketplace.visualstudio.com/items?itemName=jaluik.dot-log) in vscode extension markets.

## Usage

```javascript
xxx.log => console.log('xxx', xxx)
xxx.clg => console.log('xxx', xxx )
xxx.cwa => console.warn('xxx', xxx)
xxx.cer => console.error('xxx', xxx)
'xxxx'.log => console.log('xxxx')
```

![img](https://raw.githubusercontent.com/jaluik/dot-log/master/public/show.gif)

## Advanced

You can customize how to log the result by change VS Code Configuration Settings.

```json
    //-------- Dot Log Configuration --------
    "dotLog.config": [
        {
            "trigger": "log",  // it means .log can trigger the completion.
            "description": "quick console.log result", // it  shows completion description when triggered.
            "format": "console.log",  //the result will be format like "console.log('xxx', xxx)"
            "prefix": "",  // add the  prefix or suffix console.log(`${prefix}xxx`, xxx)
            "suffix": "",
        }
    ]
```

for example, if you set config like this, then the result will be `xxx.exam ===> example.log("before xxx after", xxx)`

```json
 "dotLog.config": [
        {
            "trigger": "exam",
            "description": "show example",
            "format": "example.log",
            "prefix": "before ",
            "suffix": " after",
        }
    ]

```

the default config is show below, you can copy it end edit it.

```json
    "dotLog.config": [
        {
            "trigger": "log",
            "description": "quick console.log result",
            "format": "console.log",
            "prefix": "",
            "suffix": "",
        },
        {
            "trigger": "clg",
            "description": "quick console.log result",
            "format": "console.log",
            "prefix": "",
            "suffix": "",
        },
        {
            "trigger": "cwa",
            "description": "quick console.warn result",
            "format": "console.warn",
            "prefix": "",
            "suffix": "",
        },
        {
            "trigger": "cer",
            "description": "quick console.err result",
            "format": "console.error",
            "prefix": "",
            "suffix": "",
        }
  ]
```

MIT © [jaluik](https://github.com/jaluik)
