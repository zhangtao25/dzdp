const request = require('request');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'meituan';

let _ids = [];

MongoClient.connect(url, function(err, client) {
  const db = client.db(dbName);
  const collection = db.collection("allid");

  collection.find({'mainid': 20059}).toArray(function (err, res) {
    // console.log(res);
    _ids = res;
  })
});


let indexbig = 0;//_ids的大索引

f2(indexbig);


// f2函数为循环每个商家
function f2(indexbig){
  setTimeout(function () {
    f(indexbig);
  },2000)
}

// f函数为循环这个商家的所有评论
function f(indexbig) {
  let index = 0;//评论页数索引
  let _counts = null;//评论页数量
  let _id = _ids[indexbig].poiId;//商家id
  let _mainid = _ids[indexbig].mainid;//大分类

  let timer = setInterval(function () {
    index++;
    // 配置请求
    let url1 = `http://www.meituan.com/meishi/api/poi/getMerchantComment?`+
      `uuid=1ad307ea0f3f4b208546.1525850606.1.0.0&`+
      `platform=1&partner=126&`+
      `originUrl=http%3A%2F%2Fwww.meituan.com%2Fmeishi%2F6369624%2F&`+
      `riskLevel=1&`+
      `optimusCode=1&`+
      `id=`+_id+`&`+//设置商家ID
      `userId=&`+
      `offset=`+index+`0&`+//设置页数
      `pageSize=20&`+
      `sortType=1`

    let options = {
      url: url1,
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Connection': 'keep-alive',
        'Cookie': 'uuid=1ad307ea0f3f4b208546.1525850606.1.0.0; _lxsdk_cuid=16343c88fc0c8-0e35990c6038b6-f373567-144000-16343c88fc0c8; ci=10; rvct=10; client-id=dd0876c4-9f6f-44b1-98d5-7c7776d89a74; _lxsdk=16343c88fc0c8-0e35990c6038b6-f373567-144000-16343c88fc0c8; lat=31.041396; lng=121.465291; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; __mta=251614905.1525850607661.1525850621748.1525851749717.3; _lxsdk_s=16343c88fc1-887-39e-570%7C%7C14',
        'Host': 'www.meituan.com',
        'Referer': 'http://www.meituan.com/meishi/6369624/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
      },
      gzip:true
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        let _body = JSON.parse(body);
        _counts = Math.floor(_body.data.total/10)-1;
        console.log('这是第'+indexbig+'个商家','_counts的值为'+_counts+',这是第'+index+'次');

        let _comments = [];//将要入库的数据

        // 循环添加
        for (let i=0 ;i<10;i++){
          _comments.push({'mainid':_mainid,'poiId':_id,_comment:_body.data.comments[i].comment});
        }

        // 数据入库
        MongoClient.connect(url, function(err, client) {
          const db = client.db(dbName);
          const collection = db.collection("allcomment");

          collection.insertMany(_comments,function (err,res) {
            console.log("插入的文档数量为: " + res.insertedCount);
          })
        });
      }
    }
    request(options, callback);

    // 终止条件
    if (index==_counts){
      clearInterval(timer);
      // 循环到最后一个商家为止
      if (indexbig!=(_ids.length-1)){
        indexbig++;
        f2(indexbig);
      }
    }
  },1200)
}




