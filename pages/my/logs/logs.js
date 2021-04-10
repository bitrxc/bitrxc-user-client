// @ts-check pages/my/logs/logs.js
import { request } from "../../../libs/request.js";
import { APIResult, Schedule } from "../../../libs/data.d.js";
const app = getApp();
const mapping = {
  new : "新请求",
  onhold : "处理中",
  receive : "已通过，待签到",
  reject : "已拒绝",
  cancel : "已取消",
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [
    ],
    selfonly:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /** @type {WechatMiniprogram.RequestSuccessCallbackResult<APIResult<{timelist:Array}>>} */
    let scheduleRes = await request({
      url: app.globalData.server + '/schedule/all',
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** @type {Array<Schedule>} */
    let schedule = APIResult.checkAPIResult(scheduleRes.data).timelist;
    let res = await request({
      url: app.globalData.server + "/appointment/username/"+app.globalData.openid,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** 加载到的预约列表
     *  @type {Array<any>} */
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
    //适配前端属性名
    for(let i of apList){
      i.roomName = roomMap.get(i.roomId);
      i.userName = userMap.get(i.launcher);
      i.result = mapping[i.status];
      let dateO =  new Date(i.launchDate)
      i.dateTime = dateO.toLocaleString("zh-cn");
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

