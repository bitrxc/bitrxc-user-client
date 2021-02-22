import { request } from "../../../request/index.js";
// pages/my/personalSet/personalSet.js
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  data: {

  },

  methods:{
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
      let res = await request({
        url:"https://test.ruixincommunity.cn/user/"+app.globalData.openid,
        header:app.globalData.APIHeader,
        method:"GET",
      })
      console.log(res);
      let userInfo = res.data.data.userInfo
      this.setData({
        user:userInfo,
      })
    },
    replaceUserInfo:async function (e) {
      let rawInfo = e.detail.userInfo;
      console.log(rawInfo)
      app.globalData.userInfo = rawInfo;

      let newInfo = {
        username : app.globalData.openid,
        name : rawInfo.nickName,
      }
      console.log(newInfo)
      this.setData({
        userInfo: newInfo ,
      })
      let res = await request({
        url:"https://test.ruixincommunity.cn/user",
        header:app.globalData.APIHeader,
        method:"POST",
        data: newInfo,
      })
      console.log(res);
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
  },
})