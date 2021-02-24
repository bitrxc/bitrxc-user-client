
var app = getApp();
Page({
  data: {
    dayList: [//yysj表示预约时间，roomName表示房间名字，yyrxm表示预约人姓名，rs表示使用人数，ytsm表示用途说明，yyzt表示预约状态
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
     
    ]
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
        })
      },
    })
    console.log(this.data.windowHeight)
  },


})
