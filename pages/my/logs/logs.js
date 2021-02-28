import { request } from "../../../request/index.js";
// pages/my/logs/logs.js 
const app = getApp();
const mapping = {
  new : "新请求",
  onhold : "处理中",
  receive : "已通过",
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
    /** @type {WechatMiniprogram.RequestSuccessCallbackResult} */
    let scheduleRes = await request({
      url: app.globalData.server + '/schedule/all',
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** @type {Array} */
    let schedule = scheduleRes.data.data.timeList;

    //加载预约列表
    let res = await request({
      url: app.globalData.server + "/appointment/username/"+app.globalData.openid,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let apList = res.data.data.appointments;
    console.log(Object.assign({},res.data))
    
    //为什么有两段相似代码？API URL入口点、被映射的属性名和API数据的存储位置都需要定制，复杂度过高。
    /** 提取房间Id，转换成房间名称
     * @type {Map<number,string>} */
    let roomMap = new Map();
    for(let i of apList){
      roomMap.set(i.roomId,"");
    }
  
    //加载涉及到的房间名称
    for(let [i,] of roomMap){
      let roomNameRes = await request({
        url: app.globalData.server + "/room/"+i,
        header: app.globalData.APIHeader,
        method:"GET",
      })
      console.log(roomNameRes.data.data)
      roomMap.set(i,roomNameRes.data.data.roomInfo.name);
    }
    /** 提取用户Id，转换成用户名称
     * @type {Map<string,string>} */
    let userMap = new Map();
    for(let i of apList){
      userMap.set(i.launcher,"");
    }
  
    //加载涉及到的用户名称
    for(let [i,] of userMap){
      let roomNameRes = await request({
        url: app.globalData.server + "/user/" +i,
        header: app.globalData.APIHeader,
        method:"GET",
      })
      console.log(roomNameRes.data.data)
      userMap.set(i,roomNameRes.data.data.userInfo.name);
    }
    
    //适配前端属性名
    for(let i of apList){
      i.roomName = roomMap.get(i.roomId);
      i.userName = userMap.get(i.launcher);
      i.result = mapping[i.status];
      let dateO =  new Date(i.dealDate)
      i.date = dateO.toDateString();
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


