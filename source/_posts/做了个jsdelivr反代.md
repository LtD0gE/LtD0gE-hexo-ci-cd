---
title: 做了个JSDelivr反代
date: 2022-03-28 17:06:00
categories: 未分类
---

JSDelivr因ICP执照被吊销，国内访问被迫转全球线路已经有一段时间了，JSDelivr在国内的访问体验一直不好。

我做了个JSDelivr反代，访问速度上有明显提升。

反代域名：

```text
jsdrp.ltdoge.top
jsdrp.vercel.app
```

两个域名没什么区别，想用哪个用哪个，反代的是cdn.jsdelivr.net。使用时直接替换域名即可。比如：

```text
https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
```

可以用以下两个url替换，二选一：

```text
https://jsdrp.ltdoge.top/npm/jquery@3.2.1/dist/jquery.min.js
https://jsdrp.vercel.app/npm/jquery@3.2.1/dist/jquery.min.js
```

稳定不跑路。