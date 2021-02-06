//  pages/room/room.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isEmptyList:false,
  },
   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshList('https://test.ruixincommunity.cn/admin/room/get/rooms/0/20');

  },
  onFilterChange:function (event) {
    this.refreshList('https://test.ruixincommunity.cn/admin/room/get/nameLike?name=' + event.detail.value)
  },
  onReturn:function (event) {
    this.refreshList('https://test.ruixincommunity.cn/admin/room/get/rooms/0/20');
  },
  refreshList:function(url){
    wx.request({
      url: url,//测试用接口
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        //1:在控制台打印一下返回的res.data数据
        console.log(res.data)
        let list = res.data.data.items;
        if(list===undefined){
          this.setData({
            list: [],
            isEmptyList:true,
          })
        }else{
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
            list: list,
            isEmptyList:false,
          })
        }
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