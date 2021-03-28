// @ts-check pages/room/roomDetail.js
import { request } from "../../libs/request.js";
import { Room } from "../../libs/data.d.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    area:12,
    pnum:15,
    roomId:NaN,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    await app.globalData.userInfoP;
    this.data.roomId = Number(options.roomID);
    let res = await request({
      url: app.globalData.server + '/room/'+this.data.roomId,
      header: getApp().globalData.APIHeader,
      method:"GET",
    })
    /** @type {Room} */
    let room = res.data.data.roomInfo;
    console.log(res.data)
    if(room.gallery===null||room.gallery===undefined){
      room.gallery=[
        {
          image:"/pages/room/img/123.jpg",
          url:"",
        },
        {
          image:"/icons/Contact.png",
          url:"",
        },
      ]
    }else if(typeof room.gallery === "number"){
      //TODO:后端没有封装相册
    }

    if(room.description===null){
      room.description="暂无描述"
    }
    this.setData({
      room:room
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
  },
  tofunction: function (e) {
    wx.navigateTo({
      url: './room1/room1?roomId='+this.data.roomId,
    })
  }
})