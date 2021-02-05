//  pages/room/room.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:[],

  },
   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://test.ruixincommunity.cn/admin/room/get/rooms/0/20',//测试用接口
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        //1:在控制台打印一下返回的res.data数据
        console.log(res.data)
        let list = res.data.data.items;
        for(let items of list){
          if(items.image===null){
            items.image="img/123.jpg"
          }
          if(items.description===null){
            items.description="暂无描述"
          }
        }
        //2:在请求接口成功之后，用setData渲染数据
        this.setData({
          //第一个data为固定用法
          list: list
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

  },
  
  tofunction: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})