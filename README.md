# fis3-command-webfont

---


## 背景与简介

目前移动端webfont字体使用越来越广泛，由于缺少比较好的自动化工具，开发者在修改字体图标时需要在2个平台进行转换(svg转ttf再转woff2,woff2普遍不支持)才能完成字体生成工作。

经过调研，基于[grunt-webfont](https://github.com/sapegin/grunt-webfont)改造成fis插件，实现一键转换svg图标为svg,oet,ttf,woff的功能。


您可以通过第三方平台来了解字体生成与转换过程: https://icomoon.io/app/#/select/font 、 https://everythingfonts.com/#

## 开始使用

### 安装插件

执行 `npm install -g fis3-command-webfont` 全局安装

### 配置插件（也可通过命令行来配置）

在fis-conf.js里面添加配置：


```javascript

fis.config.set("webfont",{
    src       : 'fonts/*.svg',//或['./fonts/home2.svg', './fonts/home3.svg']
    dest      : './fonts/compile',  //产出字体目录

    order     : 'name', //name或者time //图标按名称还是按修改时间排序，默认按名称排序
    hashes    :  false,//是否增加时间戳
    syntax    : 'bootstrap',//输出样式模板, boostrap or reasy
    types     : 'eot,svg,woff,ttf'//输出字体
});

```

`注意`：每个图标都会递增生成对应的uinicode，为了避免更新后编码变动，建议icon按字母顺序加前缀并按名称排序


### 命令行

 >    fis3 webfont -r **.svg -d ./fonts/ -n iconfont

 * -r 指定需要转化的svg字体（可用glob表达式）
 * -d 指定输出目录
 * -n 指定输出字体名称


如果您不需要产出某些字体，请在fis-conf.js配置里面添加一项指定产出字体:

```
types : 'eot,svg,woff,ttf'
```

### 关于`XP下<=IE8`的兼容性问题

> `grunt-font`已经明确将不再对ie8及以下进行完全兼容，所以生成字体在ie8及以下可能会出现无法显示的情况。
现已知**`XP下的IE8在服务器环境下`**可能无法显示webfont, 需要兼容IE8的可以尝试加上`respond.js`以及`html5shiv.js`来解决。

