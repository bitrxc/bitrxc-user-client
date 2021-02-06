// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*头像昵称获取*/
    flag: true,
    index: -1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    /*功能菜单*/
    h: app.globalData.h,
    functions: [{
      icon: "/icons/Set.png",
      name: "预约进度",
      url: "../my/process/process"
    },
    {
      icon: "/icons/Set.png",
      name: "预约记录",
      url: "../my/logs/logs"
    },
    {
      icon: "/icons/Set.png",
      name: "随便什么",
      /*url: "../ar/ar"*/
    },
    {
      icon: "/icons/Set.png",
      name: "我的消息",
      url: "../my/message/message"
    },
    {
      icon: "/icons/Set.png",
      name: "我的评价",
      url: "../my/evaluation/evaluation"
    },
    {
      icon: "/icons/Set.png",
      name: "个人设置",
      url: "../my/personalSet/personalSet"
    },
    ]
  },
  // 事件处理函数
  
   /*bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },*/
   /* 生命周期函数--监听页面加载*/
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
     url: e.currentTarget.dataset.url,
     })
  }
})