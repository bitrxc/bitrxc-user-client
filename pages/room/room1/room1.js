import { request } from "../../../request/index.js";
const profile = {
  weekbegin : Date.parse("2021-02-28"),
}
const app = getApp()
// js
Page({
  data: {
    roomName: "",
    show: false,
    weekList: ['1','2','3','4','5','6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    day: ['一','二','三','四','五','六','日'],
    wlist: [ //djz表示第几周，xqj表示星期几，yysd表示预约时段，yycd表示预约长度（固定为1），zt表示房间状态
      {"djz":8, "xqj": 4, "yysd": 2, "yycd": 1, "zt": "已预约",  "color": 1 },   //用户已预约时段用1表示
      {"djz":8,  "xqj": 1, "yysd": 2, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8,  "xqj": 2, "yysd": 1, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8, "xqj": 1, "yysd": 1, "yycd": 1, "zt": "来晚了",  "color": -1 },   //不可预约时段用-1表示
    ],
  },
  //初始化页面标题
  onLoad: async function (options) {
    let res = await wx.getSystemInfo()
    let roomRes = await request({
      url: 'https://test.ruixincommunity.cn/room/'+options.roomID,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let room = roomRes.data.data.roomInfo;
    console.log(roomRes.data)
    this.setData({
      windowHeight: res.windowHeight,
      roomName: room.name,
      roomID: room.id,
    })
  },

  clickShow: function (e) { //显示周下拉菜单
    var that = this;
    that.setData({
      show: !that.data.show,
    })
  },

  clickHide: function (e) { //隐藏周下拉菜单
    var that = this
    that.setData({
      show: false
    })
  },

  stopTouchMove: function () {
    return false;
  },

  showCardView: function (e) { //点击可预约区域，弹框显示预约信息
    console.log(e)
    let cardView = { ...e.currentTarget.dataset.wlist }
    if(e.currentTarget.dataset.wlist.color === 0){
      this.setData({
        cardView: cardView
      })
      this.util("open");
    }
  },

  hideModal() { //点击弹框外空白处收起弹框(取消按钮相同)
    this.util("close");
  },

  onOK:async function () {  //确定按钮

    let apInfo = this.data.cardView
    await request({
      url : "https://test.ruixincommunity.cn/appointment/appoint",
      header : app.globalData.APIHeader ,
      method : "POST",
      data : {
        roomId : this.data.roomID,
        launcher : app.globalData.userInfo.username,
        launchTime : apInfo.yysd,
      }
    })
    this.util("close");
    
  },
  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 100, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation
      })

      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
    }
  },
})
