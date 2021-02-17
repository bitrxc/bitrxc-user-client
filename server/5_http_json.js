var http = require("http");

var server = http.createServer();

server.on("request", (req, res) => {
  var url = req.url;

  switch (url) {
    case '/swiper':
      var data = {
        "message": [
          {
            "img_src": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/20210110200225.png",
            "img_id" : 1
          },
          {
            "img_src": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/20210110202214.png",
            "img_id" : 2
          },
          {
            "img_src": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/20210110234550.png",
            "img_id" : 3 
          }
        ]
      }
      res.end(JSON.stringify(data));
      break;
    case "/category":
      var data = {
        "message": [
          {
            "cat_id": 1,
            "cat_name": "研讨室",
            "cat_pid": null,
            "cat_level": 0,
            "child": [
              {
                "room_id": 1,
    	          "room_name": "301",
    	          "room_pid": 1,
    	          "room_level": 1,
              },
              {
                "room_id": 2,
                "room_name": "302",
                "room_pid": 1,
                "room_level": 1
              }
            ]
          },
          {
            "cat_id": 2,
            "cat_name": "自习室",
            "cat_pid": null,
            "cat_level": 0,
            "child": [
              {
                "room_id": 1,
    	          "room_name": "102",
    	          "room_pid": 1,
    	          "room_level": 1,
              },
              {
                "room_id": 2,
                "room_name": "103",
                "room_pid": 1,
                "room_level": 1
              }
            ]
          },
          {
            "cat_id": 3,
            "cat_name": "咖啡馆",
            "cat_pid": null,
            "cat_level": 0,
            "child": [
              {
                "room_id": 1,
    	          "room_name": "505",
    	          "room_pid": 1,
    	          "room_level": 1,
              },
              {
                "room_id": 2,
                "room_name": "459",
                "room_pid": 1,
                "room_level": 1
              }
            ]
          },
        ]
      };
      res.setHeader('Content-Type', 'text/plain; charset=utf8');
      res.end(JSON.stringify(data));
      break;
    case "/room":
      var data = {
        "message": {
          "room_id": 12,
          "room_name": "301",
          "room_introduction": "这个房间里面有放映机, 椅子也很多",
          "room_imgs": [
            {
              "img_id": 1,
              "img_url": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/image-20201220214137180.png",
            },
            {
              "img_id": 2,
              "img_url": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/image-20201220214621358.png",
            },
            {
              "img_id": 3,
              "img_url": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/image-20201220215041792.png",
            },
            {
              "img_id": 4,
              "img_url": "https://cdn.jsdelivr.net/gh/a-layfolk/FigureBed/img/course/Principles_of_Computer_Organization/image-20201220215849811.png"
            }
          ],
          "room_time": [
            {
              "time": "8:00-10:00",
              "status": "已预约"
            },
            {
              "time": "10:00-12:00",
              "status": "未预约"
            },
            {
              "time": "14:00-16:00",
              "status": "正在维修"
            },
            {
              "time": "16:00-18:00",
              "status": "已预约"
            },
            {
              "time": "20:00-22:00",
              "status": "未预约"
            }
          ]
        }
      }
      res.end(JSON.stringify(data));
      break;
    case "/order": 
      var data = {
        "message": [
          {
            "order_id": 1,
            "room_id": 1,
            "order_day": "2020/12/13",
            "order_time": "10:00-12:00",
            "order_user": "冯诺依曼"
          },
          {
            "order_id": 2,
            "room_id": 1,
            "order_day": "2020/12/14",
            "order_time": "10:00-12:00",
            "order_user": "冯诺依曼"
          },
          {
            "order_id": 3,
            "room_id": 3,
            "order_day": "2020/12/15",
            "order_time": "10:00-12:00",
            "order_user": "冯诺伊曼"
          },
          {
            "order_id": 4,
            "room_id": 3,
            "order_day": "2020/12/15",
            "order_time": "10:00-12:00",
            "order_user": "冯诺伊曼"
          }
        ]
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf8');
      res.end(JSON.stringify(data));
      break;
    default:
      break;
  }
});

server.listen(8000, () => {
  console.log("服务器启动成功");
});