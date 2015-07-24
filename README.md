# HTML 布局环境搭建

### 模块依赖
nodejs、npm、gulp

一、Windows 下 nodejs 安装（两种安装方法，可以选择第二种）

1.在http://nodejs.org/download/处下载对应的msi文件，点击安装，一路到底，结束；

2.同样是在http://nodejs.org/download/处，下载Windows Binary (.exe)格式的文件node.exe，然后放置在D:\nodejs文件夹下面，将D:\nodejs文件夹加入系统PATH变量，以便全局都可以使用，结束；

可以在dos下用 node -v 命令测试。


二、Windows 下 npm 安装

1.在https://github.com/isaacs/npm/tags处获取NPM的源码，如果已经安装过Git的，也可以通过git下载：

git clone --recursive git://github.com/isaacs/npm.git

2.下载到NPM的源码后，解压缩，比如我们解压在D:\npm，在DOS中，转到此文件夹下，然后执行如下命令安装NPM：

node cli.js install npm -gf
完成后，将D:\nodejs\node_modules文件夹加入PATH系统变量，并删除D:\npm文件夹（没用了）即可。

可以在dos下用 npm -v 命令测试。


PS: 由于我大天朝的墙，可能你用npm安装其他模块的时候会经常安装不了，这里就得用上 淘宝的 NPM 镜像了（好东西，感谢ing....）
cnpm 安装很简单在你的doc中键入下面的命令：
npm install -g cnpm --registry=https://registry.npm.taobao.org
等待完成......
后面就可以像使用npm一样来使用cnpm了，cnpm支持所有的npm命令

三、Windows 下 gulp 安装（这里就用CNPM来安装模块了）

在你的doc里敲入：
cnpm install --g gulp 

到这里我们主要依赖的三大环境已经一切就署，但不要急，能运行起less的还差最后一步呢，请往下看

四、less编译
打开cmd 切换到 svn paycss 目录，运行命令
cnpm install (对应npm就是  npm install)