// pages/room/roomDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://test.ruixincommunity.cn/room/'+options.roomID,
      header: {
        'content-type': 'application/json'
      },
      method:"GET",
      success: res => {
        //1:在控制台打印一下返回的res.data数据
        let items = res.data.data.roomInfo;
        console.log(items)
        if(items.gallery===null||items.gallery===undefined){
          items.gallery=[
            {
              image:"/pages/room/img/123.jpg",
              url:"",
            },
            {
              image:"/icons/Contact.png",
              url:"",
            },
          ]
        }
        if(items.description===null){
          items.description="暂无描述"
        }
        this.setData({
          room:items
        })
      }
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