---
title: 使用GitHub与Hexo搭建静态博客
date: 2022-02-04 17:28:07
categories: 未分类
---

# 0x00

相信各位已经发现了，这个网站在2年多之后又迎来了一次大改版。

为什么？因为我之前的服务器被删库了，数据恢复不出来。（悲）

因此，我用Hexo把网站改成了静态站点，并将作为以后主要的博客程序。

之前的20多篇文章有空就会恢复啦，不用担心~

# 0x01  初始化

*此教程依作者使用习惯，主要面向Linux用户。Windows用户请使用WSL或自行安装相关组件的Windows版本（如Windows版Git或Github Desktop）。*

首先我们要安装NodeJS运行环境。

```bash
sudo apt-get install nodejs npm  #这是Linux的安装命令，Windows用户请去官网下载
```

需要注意的是有些Linux发行版的NodeJS可能不是最新版本。我们需要到[NodeJS官网](https://nodejs.org/en/download/)去下载LTS版本的程序。

![](https://pic.imgdb.cn/item/61fcf66a2ab3f51d91727140.jpg)

Windows用户直接通过下载的msi文件安装即可，Linux用户则需要把解压后的文件复制到/usr目录下。

![](https://pic.imgdb.cn/item/61fcf6fa2ab3f51d9172fcc0.jpg)

```bash
sudo cp NodeJS解压路径 /usr
sudo npm i npm@latest -g  #升级npm至最新版
```

随后安装Hexo，然后初始化博客程序。

```bash
sudo npm i hexo-cli -g
hexo init 要存放博客的文件夹名，下文以blog代替
cd blog
sudo npm i
```

然后使用Visual Studio Code等代码编辑器编辑blog文件夹内的_config.yml，配置文件说明在此：[配置 | Hexo](https://hexo.io/zh-cn/docs/configuration)，可以将[我的配置文件](https://github.com/LtD0gE/LtD0gE-hexo-ci-cd/blob/main/_config.yml)作为参考。

配置好后，我们可以在本地启动服务器进行测试。

```bash
hexo server
```

然后访问http://localhost:4000/查看配置是否正确。

# 0x02  主题

[Hexo主题官网](https://hexo.io/themes/index.html)提供大量主题下载。

![](https://pic.imgdb.cn/item/61fcfae12ab3f51d9176d15d.jpg)

点击任意主题下面的蓝色主题名可以跳转到对应主题的GitHub界面，我们可以根据README.md里的安装说明安装主题。比如我网站安装的主题是Fluid，根据其[GitHub页面](https://github.com/fluid-dev/hexo-theme-fluid)的说明，通过npm安装主题：

```bash
cd blog
sudo npm install --save hexo-theme-fluid
```

然后在blog目录下新建\_config.fluid.yml文件，把[这个配置文件](https://github.com/fluid-dev/hexo-theme-fluid/blob/master/_config.yml)的内容复制进去。配置的注释里已经写的很详细了，每个人的需求也不同，这里不再给出具体示例。

如果使用Fluid主题且使用APlayer等音乐播放器的话，可以参照[我的这个issue](https://github.com/fluid-dev/hexo-theme-fluid/issues/651)给主题添加Pjax，目前没有遇到什么问题。需要注意要在主题配置文件里关闭“回到顶部”按钮，否则控制台会一直报错（相关事件已在pjax中重载，按钮的显示没有问题，如果不介意的话可以开启）。需要注意的是这种做法并不被Fluid官方所采纳（原因见[issue#189 (comment)](https://github.com/fluid-dev/hexo-theme-fluid/issues/189#issuecomment-1029742263)）。

如果你想使用音乐播放器又不想在跳转页面被打断的话，可以考虑使用NexT主题，文档链接[在此](https://theme-next.js.org/docs/getting-started/)。

# 0x03  写作 & 发布

使用以下命令初始化文档。

```bash
hexo new "文章标题"
```

然后在博客目录下source/_posts文件夹中会生成以文章标题命名的.md文件。文件开头会有一些配置内容：

```markdown
---
title: HelloWorld   #文章标题
date: 2077-01-01 11:11:11    #文章发布时间
updated: 2077-01-01 12:12:12   #文章更新时间
comments: true   #是否开启评论
tags: aaa   #文章标签，不适用于单独页面
categories: bbb   #文章分类，不适用于分页
permalink: ccc   #文章永久链接，覆盖_config.yml中的永久链接配置
excerpt: CYBERPUNK   #文章摘要
lang: zh-CN   #页面语言
#按需修改，不需要的项目可以删除
---
```

然后使用Typora等Markdown编辑器打开刚刚生成的.md文件，开始写作：

![](https://pic.imgdb.cn/item/61fd338f2ab3f51d91ac05da.jpg)

写作完成后，执行以下命令启动服务器：

```bash
hexo server
```

然后在http://localhost:4000/查看页面效果。

# 0x04  部署

只在本地跑服务器可不行，得挂到服务器上遛一遛才可以。

如果你有自己的服务器，可以用以下命令生成静态文件：

```bash
hexo generate
```

然后把public目录下的所有文件复制到服务器的网站根目录，这样就算完成部署了。

但这篇文章的目的是用**GitHub**搭建博客，也就是依托GitHub Pages的免费服务进行建站。白嫖的东西不香吗？

新建一个Git仓库，然后在Settings选项卡中，找到Pages设置，开启GitHub Pages服务：

![](https://pic.imgdb.cn/item/61fd35522ab3f51d91addef3.jpg)

如果你没有自己的域名，"www.ltdoge.top"的框可以不填，只保存Source选项即可。

开启GitHub Pages后，我们就可以通过Github Desktop等软件把hexo生成的静态页面上传到GitHub仓库，完成部署。

但，还不够简便。

GitHub近几年对公共仓库开放了GitHub Actions功能，简单来说就是免费提供一台服务器，可以在某个触发条件（如向仓库推送代码时）自动执行某一脚本，进行持续集成/持续部署。

这东西好诶，再开一个仓库，在新仓库根目录下创建.github/workflows文件夹，接着在里面新建一个Hexo.yml文件：

```yaml
name: HexoCI/CD  #action名称
on: [push]   #触发条件
jobs:
  GenerateAndDeploy:
    runs-on: ubuntu-latest   #运行环境，ubuntu-latest即ubuntu 20.04
    steps: 
      - name: "Checkout"   #克隆仓库代码
        uses: actions/checkout@v2
        with:
          path: "hexo"
      - name: "Initalize Node.JS environment"  #安装NodeJS运行环境
        run: |
          sudo apt install nodejs npm curl
          wget -O ./nodejs.tar.xz https://nodejs.org/dist/v16.13.2/node-v16.13.2-linux-x64.tar.xz
          tar -xvf ./nodejs.tar.xz
          cd node-v16.13.2-linux-x64
          sudo cp -R ./* /usr
          sudo npm install -g npm@latest
      - name: "Install Hexo and Generate"   #安装hexo，生成静态页面
        run: |
          sudo npm install -g hexo-cli
          cd $GITHUB_WORKSPACE/hexo
          hexo clean
          hexo generate
      - name: "Deploy to Github Pages"   #部署至GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: main   #依据个人设置修改，大部分是master
          build_dir: hexo/public
          repo: "LtD0gE/www.ltdoge.top"   #格式：Git用户名/Pages仓库名
          keep_history: true   #是否保留历史，即以commit形式提交而不是强制推送
          allow_empty_commit: false   #是否允许空commit
          commit_message: "Automatic Deploy"    #commit时的信息
        env:
          GH_PAT: ${{ secrets.GH_PAT }}   #Github Personal Access Token，需要保存在仓库secrets中，获取方法：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
      - name: "Purge Cloudflare Cache"   #清除CloudFlare缓存，如果没有用他们家CDN需要把这一步骤删去
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/CloudFlare仪表盘里的ZoneID/purge_cache" \
          -H "X-Auth-Email: CloudFlare注册邮箱"      \
          -H "X-Auth-Key: ${{ secrets.CF_API_KEY }}" \
          -H "Content-Type: application/json"      \
          --data '{"purge_everything":true}'
        # ${{ secrets.CF_API_KEY }}为CloudFlare Global API KEY，获取方法：https://lighti.me/5560.html，同样需要保存到仓库里
```

修改完配置文件后，还需要在仓库的secrets里添加Github Personal Access Token：

![](https://pic.imgdb.cn/item/61fd397b2ab3f51d91b2480a.jpg)

![](https://pic.imgdb.cn/item/61fd39a32ab3f51d91b27245.jpg)

注意GH_PAT要和配置文件里的变量名保持一致。如果要清除CloudFlare CDN缓存的话还需要把CF的API Key也添加进secrets。

这些配置做好之后，把blog目录下的所有文件推送到刚刚创建的仓库，Actions就会自动开始构建。构建完成后，网站便会自动发布。

![](https://pic.imgdb.cn/item/61fd3a302ab3f51d91b30935.jpg)

# 0x05

说到Fluid主题的Pjax，目前仍有一个问题就是控制台里“回到顶部”按钮的报错。如果有dalao在这方面有什么想法，欢迎去

[issue](https://github.com/fluid-dev/hexo-theme-fluid/issues/651)下面留言~

之前的文章有空就会恢复一部分，farewell~
