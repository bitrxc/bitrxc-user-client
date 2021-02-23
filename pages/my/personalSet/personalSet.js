import { request } from "../../../request/index.js";
// pages/my/personalSet/personalSet.js
// TODO: 通过微信平台获取电话号码
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  data: {
    editable:true,
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
      await this.setUserProfile({
        name : rawInfo.nickName,
      });
    },

    replacePhone:async function (e) {
      let rawPhone = e.detail.value;
      await this.setUserProfile({
        phone : Number(rawPhone),
      });
    },

    replaceOrg:async function (e) {
      let rawOrg = e.detail.value;
      await this.setUserProfile({
        organization : rawOrg,
      });
    },

    async setUserProfile(userInfo){
      //TODO: 电话号码校验
      let newInfo = {
        ...this.data.user,
        ...userInfo,
      }
      console.log(newInfo)
      this.setData({
        user: newInfo ,
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