// pages/my/process/process.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      {roomid: 5,id:'Amy',date:'2021.02.01', time:'12:00-13:00',process:'已通过',unique: 'unique_5'},
      {roomid: 4,id:'Bmy',date:'2021.02.02', time:'13:00-14:00',process:'预通过',unique: 'unique_4'},
      {roomid: 3,id:'Cmy',date:'2021.02.03', time:'14:00-15:00',process:'未通过',unique: 'unique_3'},
      {roomid: 2,id:'Dmy',date:'2021.02.04', time:'15:00-16:00',process:'已通过',unique: 'unique_2'},
      {roomid: 1,id:'Emy',date:'2021.02.05', time:'16:00-17:00',process:'未通过',unique: 'unique_1'},
      {roomid: 0,id:'Fmy',date:'2021.02.06', time:'12:00-13:00',process:'已通过',unique: 'unique_6'},
    ],
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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