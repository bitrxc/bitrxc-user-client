import { request } from "../../../request/index.js";
/**
 * @namespace
 */
const profile = {
  /** 第一周的星期一 */
  weekbegin : Date.parse("2021-03-01"),
  statusMap : {
    past : {
      zt : "来晚了",
      color : -1,
    },
    avaliable : {
      zt : "可预约",
      color : 1,
    },
    unreachable : {
      zt : "未开放",
      color : 0,
    },
    occupied : {
      zt : "已预约",
      color : -1,
    },
    mine : {
      zt : "已预约",
      color : -2,
    },
  }
}
const app = getApp()
// js
Page({
  data: {
    inputValue:"",
    roomName: "",
    show: false,
    weekList: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    week: 8,
    day: ['一','二','三','四','五','六','日'],
    schedule : [],
    wlist: [ //djz表示第几周，xqj表示星期几，yysd表示预约时段，yycd表示预约长度（固定为1），zt表示房间状态
      {"djz":8, "xqj": 4, "yysd": 2, "yycd": 1, "zt": "已预约",  "color": 1 },   //用户已预约时段用1表示
      {"djz":8,  "xqj": 1, "yysd": 2, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8,  "xqj": 2, "yysd": 1, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      {"djz":8, "xqj": 1, "yysd": 1, "yycd": 1, "zt": "来晚了",  "color": -1 },   //不可预约时段用-1表示
    ],
  },

  /**
   * 检查用户填写的内容
   * 提交表单中用户填写的内容
   * 更新视图
   * @param {WechatMiniprogram.FormSubmit} e 
   */
  formSubmit:async function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    /*暂时不检查人数和姓名
    if (e.detail.value.name.length == 0) {

      wx.showToast({
        title: '姓名不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else if (e.detail.value.number.length == 0) {

      wx.showToast({
        title: '人数不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else */if (e.detail.value.usefor.length == 0) {

      wx.showToast({
        title: '用途不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else {

      let apInfo = this.data.cardView;
      let execDate = new Date(apInfo.execDate);
      console.log(execDate);
      let res = await request({
        url : app.globalData.server + "/appointment/appoint",
        header : app.globalData.APIHeader ,
        method : "POST",
        data : {
          roomId : this.data.roomId,
          launcher : app.globalData.userInfo.username,
          launchTime : apInfo.yysd,
          execDate : execDate.toISOString(),
          launchDate : Date.now(),
          userNote : e.detail.value.usefor,
        }
      })
      
      console.log(res.data);
      if (res.data.code != 200) {

        wx.showToast({
          title: '提交失败！',
          icon: 'loading',
          duration: 1500,
        })

      } else {
        //刷新预约时段所在列
        let list = await this.fetchColumn(execDate);
        let dayNow = (execDate.getDay()+6) % 7+1;
        list = list.concat(
          //将待刷新的列的旧成员移除
          this.data.wlist.filter((v)=> v.xqj != dayNow)
        );
        this.setData({
          wlist:list,
        })

        await wx.showToast({
          title: '提交成功！',//这里打印出登录成功
          icon: 'success',
          duration: 1000,
        })
        //不跳转到预约进度页面，多次预约
        // await wx.navigateTo({ 
        //   url: '../../my/process/process',
        // })
        //不播放动画，关闭
        // this.util("close");
      }
    }
  },
  //初始化页面标题
  //初始化预约时间列表
  onLoad: async function (options) {
    this.data.roomId = options.roomID;
    let roomRes = await request({
      url: app.globalData.server + '/room/'+options.roomID,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let scheduleRes = await request({
      url: app.globalData.server + '/schedule/all',
      header: app.globalData.APIHeader,
      method:"GET",
    })
    console.log()

    let room = roomRes.data.data.roomInfo;
    this.setData({
      windowHeight: app.systemInfo.windowHeight,
      roomName: room.name,
      schedule :scheduleRes.data.data.timeList,
    })
    await this.refreshTable(new Date());
  },

  onShow:async function(){
    await this.refreshTable(new Date());
  },
  
  /** 
   * @param {Date} date 需要查询的周次
   * */
  refreshTable : async function(date){
    date.setDate(date.getDate() - (date.getDay() + 6)%7);
    let operations = [];
    for(let i = 0;i<7;i++){
      let newDate = new Date(date.getTime());
      newDate.setDate(newDate.getDate() + i);
      console.log(newDate);
      operations.push(this.fetchColumn(newDate))
    }
    let results = await Promise.all(operations);
    console.log(results);
    let resWlist = results.reduce(
      (prev,cur) => prev.concat(cur) ,
    [])
    this.setData({
      wlist:resWlist,
    })
  },

  /** 
   * @todo Todo:预约数据结构支持隔日预约
   * @param {Date} date 需要查询的日期
   * */
  fetchColumn :async function (date) {

    //url构造器，微信小程序不支持Web URL规范，此处还要用
    let urlBuilder = app.globalData.server +
      '/room/free/time' + '?' +
      'roomId' + '=' + this.data.roomId + '&' +
      'username' + '='  + app.globalData.userInfo.username + '&' +
      'date' + '='  + date.toISODateString();
    let listRes = await request({
      url: urlBuilder,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    console.log(listRes.data.data.freeTime)

    /**
     * 
     * @param {Array<any>} resList 
     * @param {Array<any>} externList 
     * @param {*} tag 
     */
    function marker(resList,externList,tag){
      for(let i of resList){
        if (
          externList.some((v)=>  v.id === i.id )
        ) {
          i.tag = tag;
        }
      }
    };
      
    let schedule = Array.from(this.data.schedule)
    /** */
    marker(schedule ,
      listRes.data.data.freeTime,
      profile.statusMap.avaliable
    );
    marker(schedule ,
      listRes.data.data.passTime,
      profile.statusMap.past
    );
    marker(schedule ,
      listRes.data.data.myTime,
      profile.statusMap.mine
    );
    marker(schedule ,
      listRes.data.data.busyTime,
      profile.statusMap.occupied
    );
    console.log(schedule);

    let weekNow =  Math.ceil(
      (date.getTime() - profile.weekbegin) / 
      (7  * 24 * 60 * 60 * 1000 ) 
    )
    let dayNow = (date.getDay()+6)%7 +1;
    let resWlist  = [];//this.data.wlist.filter((v)=> v.xqj != dayNow);
    for(let item of schedule){
      let res= {
        "djz": weekNow , 
        "xqj": dayNow , 
        "yysd": item.id , 
        "yycd": 1 ,
        "execDate":date.getTime() ,
      };
      res = Object.assign(res,item.tag);
      resWlist.push(res);
    }
    return resWlist;
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
});
( () => {

  function pad(number) {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }

  Date.prototype.toISODateString = function() {
    return this.getUTCFullYear() +
      '-' + pad( this.getUTCMonth() + 1 ) +
      '-' + pad( this.getUTCDate() ) ;
  };

} )();