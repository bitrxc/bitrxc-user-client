import { request } from "../../../request/index.js";
const profile = {
  weekbegin : Date.parse("2021-02-28"),
  statusMap : {
    past : {
      zt : "来晚了",
      color : -1,
    },
    occupied : {
      zt : "可预约",
      color : 1,
    },
    unreachable : {
      zt : "未开放",
      color : 0,
    },
    avaliable : {
      zt : "已预约",
      color : -1,
    },
  }
}
const app = getApp()
// js
Page({
  data: {
    roomName: "",
    show: false,
    weekList: ['1','2','3','4','5','6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    day: ['一','二','三','四','五','六','日'],
    schedule : [],
    wlist: [ //djz表示第几周，xqj表示星期几，yysd表示预约时段，yycd表示预约长度（固定为1），zt表示房间状态
      {"djz":8, "xqj": 4, "yysd": 2, "yycd": 1, "zt": "已预约",  "color": 1 },   //用户已预约时段用1表示
      {"djz":8,  "xqj": 1, "yysd": 2, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8,  "xqj": 2, "yysd": 1, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8, "xqj": 1, "yysd": 1, "yycd": 1, "zt": "来晚了",  "color": -1 },   //不可预约时段用-1表示
    ],
  },
  //初始化页面标题
  //初始化预约时间列表
  onLoad: async function (options) {
    this.data.roomId = options.roomID;
    let res = await wx.getSystemInfo()
    let roomRes = await request({
      url: 'https://test.ruixincommunity.cn/room/'+options.roomID,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let scheduleRes = await request({
      url: 'https://test.ruixincommunity.cn/schedule/all',
      header: app.globalData.APIHeader,
      method:"GET",
    })
    console.log()

    let room = roomRes.data.data.roomInfo;
    this.setData({
      windowHeight: res.windowHeight,
      roomName: room.name,
      roomID: room.id,
      schedule :scheduleRes.data.data.timeList,
    })
    await this.refreshTable();
  },

  onShow:async function(){
    await this.refreshTable();
  },
  //TODO: 预约数据结构支持隔日预约
  refreshTable :async function () {
    let listRes = await request({
      url: 'https://test.ruixincommunity.cn/room/free/time?roomId='+this.data.roomId,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    console.log(listRes.data.data.freeTime)
    /** */
    let rawList = new Set(listRes.data.data.freeTime);
    let date = new Date();
    let dateN = date.getTime();
    let resWlist  = [];
    for(let i = 0;i<7;i++){
      for(let {id,begin,end} of this.data.schedule){
        let res= {
          "djz":8, 
          "xqj": i+1, 
          "yysd": id, 
          "yycd": 1, 
        };
        if(i<date.getDay()){
          res = Object.assign(res,profile.statusMap.past)
        }else if(i>date.getDay()){
          res = Object.assign(res,profile.statusMap.unreachable)
        }else{
          if(Date.parse(end) <= dateN){
            res = Object.assign(res,profile.statusMap.past)
          }else if(rawList.has(id)){
            res = Object.assign(res,profile.statusMap.avaliable)
          }else{
            res = Object.assign(res,profile.statusMap.occupied)
          }
        }
        resWlist.push(res);
      }
    }
    console.log(resWlist);
    this.setData({
      wlist:resWlist,
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
    if(e.currentTarget.dataset.wlist.color === 1){
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
    await this.refreshTable();
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
