// @ts-check pages/index/index.js

import {request} from  "../../libs/request.js";

const app = getApp();
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      // 3:需在data中声明一个接收数据的变量。
      list: [
      ],

      focus:true,

      //放推送功能待开发，此处写死示意
      h: app.globalData.h,
      functions: [{
          image: "/pages/index/img/1.jpg", 
          url: ""
        },
        {
          image: "/pages/index/img/3.jpg",
          url: ""
        },
        {
          image: "/pages/index/img/2.jpg",
          url: ""
        }
      ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {
      let res = await request({
        url: 'https://unidemo.dcloud.net.cn/api/news',//测试
        header: {
          'content-type': 'application/json'
        },
      })

      //1:在控制台打印一下返回的res.data数据
      console.log(res.data)
      for(let item of res.data){
        item.image = item.cover;
        item.name = item.title;
        item.description = item.summary;
      }
      //2:在请求接口成功之后，用setData接收数据
      this.setData({
        //第一个data为固定用法
        list: res.data
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