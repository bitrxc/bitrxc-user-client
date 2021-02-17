# bitrxc-user-client

**BIT Ruixin Community - bitrxc**

WeChat Mini Program client for bitrxc's users

## 组成

目前开始编写的页面有

* index 首页
* category 分类
* order 订单
* user 用户
* empower 授权
* rooms_detail 房间详情

## 注意



### 关于 less 文件

**我没有使用原生的 wxss, 而是使用了 less 编译成为 wxss**

如果你使用 VS Code 编写代码, 你需要安装一个 Easy  LESS 插件, 并进行配置.

配置的文件我已放到 .vscode 文件下

**我没有使用 less 的其他语法, 仅仅运用了 less 中 css 可以嵌套这一点特性**



### 关于后端数据

**我的样式并没有写死, 必须有后端数据才能显示**

后端数据我使用 Node.js 简单模拟, 现在模拟的文件被我当道 server 文件夹下.

如果你安装有 Node 环境, 你可以直接 node ./5_http_json.js 来启动后端服务



### 关于网络请求

网络请求我简单地封装了一个 Promise 来处理, 放到了 request 文件夹下



### 关于图片

因为微信小程序不支持在 wxss 直接通过 url 引入图片, 所以将图片转换为 Base64 字符串.

所以你在 /pages/order/index.wxss 会看到一长串的字符串, 那就是图片的 Base64 编码