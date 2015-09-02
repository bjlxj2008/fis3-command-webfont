"use strict";

exports.name = 'webfont';
'use strict';

exports.usage = '[options]';
exports.desc = 'fis3 webfont generator,support svg,eot,ttf,woff';

exports.options = {
    '-n, --fontname <fontname>': 'set fontname ,default `iconfont`',
    '-r, --root <srcdir>': 'set svg icon dir',
    '-d, --dest <destdir>': 'set font dir'
};


var path = require('path');
var fs = require('fs');
var exec = require("child_process").exec;
var exists = fs.existsSync;
var webfont = require("./lib/webfont");

exports.run = function(argv, cli, env) {

    var root = env.configBase || process.cwd();

    var filepath = env.configPath || path.resolve(root, 'fis-conf.js');

    if (argv.h || argv.help) {
        return cli.help(exports.name, exports.options);
    }

    if (exists(filepath)) {
        require(filepath);
    }
    //读取配置，命令行参数优先
    var settings = fis.config.get("webfont") || {};

    argv.src = argv.root || argv.r;
    argv.dest = argv.dest || argv.d;
    argv.fontname = argv.fontname || argv.n;


    ['fontname', 'dest', 'src'].forEach(function(i) {
        settings[i] = argv[i] || settings[i];

        if (i === 'fontname') {
            if (!settings[i]) {
                settings[i] = 'iconfont';
            }
        } else if (i === 'src') { //根据src计算出字体目录
            var paths = [];
            if (settings[i] instanceof Array) {
                for (var j = 0, l = settings[i].length; j < l; j++) {
                    paths[j] = path.join(root, settings[i][j]);
                }

            } else {
                if (!settings[i]) {
                    //如果没有设置root,则自动处理全目录svg
                    settings[i] = '**.svg';
                }

                var files = fis.project.getSourceByPatterns(settings[i]),
                    j = 0,
                    ignore = path.join(settings['dest'], settings['fontname']).replace(/\\/g, '/');

                for (var file in files) {
                    if (ignore === files[file].realpathNoExt) {
                        continue; //防止被生成的字体再次进行编译转化
                    }

                    paths[j++] = files[file].realpath;
                }
            }

            settings[i] = paths;
        } else if (i === 'dest') {
            if (!settings[i]) {
                settings[i] = './fonts/';
            }
            if (!path.isAbsolute(settings[i])) {
                settings[i] = path.join(root, settings[i]);
            }
        }
    });


    //console.log(settings);

    //导出字体
    webfont.generateFonts(settings);

};
