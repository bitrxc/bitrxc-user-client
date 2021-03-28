// @ts-check pages/my/my.js
const app = getApp();
//my页面只负责渲染页面，不负责拉取用户数据，由个人信息页面负责拉取和更新数据。
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /*头像昵称获取*/
    flag: true,
    index: -1,
    userInfo: {},
    complete: false,
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
      name: "个人设置",
      url: "../my/personalSet/personalSet"
    },
    ]
  },
  // 事件处理函数
   /* 生命周期函数--监听页面加载*/
  async onLoad() {
    //阻塞onload函数，等待用户信息返回
    await app.globalData.userInfoP
    let userInfoVisible = {...app.globalData.userInfo};
    userInfoVisible.avatarUrl 
      = userInfoVisible.avatarUrl
        ? userInfoVisible.avatarUrl 
        : "/pages/room/img/123.jpg";
    //阻塞解除后，新的用户信息已经存在于全局数据中。
    this.setData({
      userInfo: userInfoVisible,
      complete: app.globalData.userInfoComplete,
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