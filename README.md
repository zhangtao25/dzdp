说明
1.数据库为mongodb，建一个“meituan”的db，新建两个集合，“allid”和“allcomment”。
2.http://sh.meituan.com/meishi/为目标网址，字母c+数字代表类似“火锅”、“日本料理”等分类。
3.美团网站都是通过get获取数据，所以直接通过node的request包发送请求即可获取数据。
4.app2.js用于抓取当前分类的所有店铺的id，存储在allid集合内。
5.app.js用于抓取当前分类的每个店铺的评论，存储在allcomment集合内。

运行：
先运行app2.js抓取id，再运行app.js通过id抓取评论。更改mainid即可更换抓取分类。

注：app2.js可能抓取失败，需要更换最新的_token。