const request = require('request');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'meituan';

let index = 0;//商家页数索引
let _counts = null;//商家页数量
let mainid = 20059;//大分类，例如火锅的mainid为17

let timer = setInterval(function () {
  index++;
  // 配置请求
  let url1 = `http://sh.meituan.com/meishi/api/poi/getPoiList?cityName=%E4%B8%8A%E6%B5%B7&cateId=`+mainid+
    `&areaId=0&sort=&dinnerCountAttrId=&page=`+index+
    `&userId=0&uuid=5e9d890a12ec4efca84e.1525927716.1.0.0&platform=1&partner=126&originUrl=http%3A%2F%2Fsh.meituan.com%2Fmeishi%2Fc20060%2F&riskLevel=1&optimusCode=1&` +
    `_token=eJx9j81yokAUhd+lt1B2Cw20VmWBShSVICJInMqCv9gojSAogVTePZ2Ks5jNrM653z116t5PcDUTMB4iNEJIBPf0CsZgOEADFYigqflGkVQ0HBGEZVkTQfwvw5oqgujqz8D4z1CRVVHG8tsP2XLwS4iK38SHlbiVsPgjIDJ5BNCmKccQ1nTA0qy5hcUgvjDIfU0zWBYS5Gf8NwN4FdvxKq7nh4YPbf7OFn+KF9XZseAuXbb56ZxXem842xRm9BCGm4XjImuNOjYlXbs4+02e3Ga+s6I5mSSkWOrxyvYSo76XdxIwkrvvLRWmiM362abT4e6kTgWoqLD4INlFL/VXSVkmuPegYAYTeqoky8Zmb9LnxNI0F7OIkZXvF3NnrgiuWyyeg8KurKpzyy2c7GPN28RlrL0WbrZW0I1JhmSMgtCwuy4Ju4N0yffHu3rdW2taRpGTtjSyX1g7nxNt9+FVfbNrmuASByaWPa8aCfohYq59fAJf3+r/lys=`
    // 这上面更换token
  let options = {
    url: url1,
    headers:{
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'Connection': 'keep-alive',
      'Cookie': '_lxsdk_cuid=16343c88fc0c8-0e35990c6038b6-f373567-144000-16343c88fc0c8; ci=10; rvct=10; client-id=b6308805-8119-42b4-997b-14282a82684f; __mta=251614905.1525850607661.1525855554370.1525857592439.10; uuid=5e9d890a12ec4efca84e.1525927716.1.0.0; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; __mta=251614905.1525850607661.1525857592439.1525927718597.11; _lxsdk=16343c88fc0c8-0e35990c6038b6-f373567-144000-16343c88fc0c8; lat=31.041396; lng=121.465291; _lxsdk_s=16348612d1c-c50-32f-4f3%7C%7C64',
      'Host': 'sh.meituan.com',
      'Referer': 'http://sh.meituan.com/meishi/c20060/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    },
    gzip:true
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      let _body = JSON.parse(body);
      let arr = [];
      _counts = Math.floor(_body.data.totalCounts/32);

      for (let i =0;i<32;i++){
        arr.push({'mainid':mainid,'poiId':_body.data.poiInfos[i].poiId})

      }

      console.log('这是第'+index+'页，一共'+_counts+'页');

      // 数据入库
      MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection("allid");

        collection.insertMany(arr,function (err,res) {
          console.log("插入的文档数量为: " + res.insertedCount);
        })
      });
    }
  }
  request(options, callback);

  // 终止条件
  if (index==_counts){
    clearInterval(timer);
  }
},3000)