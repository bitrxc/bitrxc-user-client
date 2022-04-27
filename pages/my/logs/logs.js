// @ts-check pages/my/logs/logs.js
import { request } from "../../../libs/request.js";
import { APIResult } from "../../../libs/data.d.js";
import { EnhancedDate } from "../../../libs/EnhancedDate.js";
/** @typedef {import("../../../typings/display").appointmentCard} appointmentCard */
/** @type {import("../../../app.js").MiniprogramContext} */
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** @type {Array<appointmentCard>} */
    array: [
    ],
    selfonly:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await request({
      url: app.globalData.server + "/appointment/username/"+app.globalData.openid,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** 加载到的预约列表
    /** @type {Array<Deal & appointmentCard>} */
    let apList = APIResult.checkAPIResult(res.data).appointments;
    apList.sort(
      (a,b)=> {
        let aDate = Date.parse(a.launchDate) ;
        let bDate = Date.parse(b.launchDate) ;
        if(aDate > bDate){
          return 1;
        }else if(aDate == bDate){
          return 0;
        }else{
          return -1;
        }
      }
    );
    //为什么有两段相似代码？API URL入口点、被映射的属性名和API数据的存储位置都需要定制，复杂度过高。
    /** 提取房间Id
     * @type {Map<number,string>} */
    let roomMap = new Map();
    for(let i of apList){
      roomMap.set(i.roomId,"");
    }
    //加载涉及到的房间名称
    //BUG: 房间和用户有可能不存在，此时应该忽略不存在的房间
    for(let [i,] of roomMap){
      try{
        let roomNameRes = await request({
          url: app.globalData.server + "/room/"+i,
          header: app.globalData.APIHeader,
          method:"GET",
        })
        roomMap.set(i,APIResult.checkAPIResult(roomNameRes.data).roomInfo.name);
      }catch(e){
        roomMap.set(i,"房间未找到");
      }
    }

    /** 如果显示其他用户，则提取用户Id
     * @type {Map<string,string>} */
    let userMap = new Map();
    for(let i of apList){
      userMap.set(i.launcher,"");
    }
    if(!this.data.selfonly){
      //加载涉及到的用户名称
      for(let [i,] of userMap){
        try{
          let roomNameRes = await request({
            url: app.globalData.server + "/user/" +i,
            header: app.globalData.APIHeader,
            method:"GET",
          })
          userMap.set(i,APIResult.checkAPIResult(roomNameRes.data).userInfo.name);
        }catch(e){
          userMap.set(i,"用户未找到");
        }
      }
    }
    let schedule = app.globalData.schedule;
    //适配前端属性名
    for(let i of apList){
      i.roomName = roomMap.get(i.roomId);
      i.userName = userMap.get(i.launcher);
      i.statusText = app.globalData.appointmentStatus[i.status];;
      let dateO =  new EnhancedDate({date:new Date(i.launchDate)})
      i.launchTime = dateO.toLocaleString("zh");
      i.week = dateO.week;
      const weekDay = ['一','二','三','四','五','六','日']
      i.weekDay = weekDay[dateO.weekDay-1];
      if(i.begin == i.end){
        i.schedule = i.begin;
      }else{
        i.schedule = i.begin + "、" + i.end;
      }
      i.beginTime = schedule.get(i.begin)?.begin;
      i.endTime = schedule.get(i.end)?.end;
      i.rs = i.attendance
      /** @type {String} */
      let noteO = i.userNote
      if(!noteO){
        noteO = "暂无说明"
      }
      noteO = noteO.substring(0,20);
      i.ytsm = noteO;
    }
    this.setData({
      windowHeight: app.systemInfo.windowHeight,
      array:apList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})

