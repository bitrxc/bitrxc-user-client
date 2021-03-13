// @ts-check pages/my/personalSet/personalSet.js
// TODO: 通过微信平台获取电话号码
// TODO: 向用户请求权限，并维护全局用户信息

import { request } from "../../../libs/request.js";
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

    },

    /**
     * 
     * @param {WechatMiniprogram.ButtonGetUserInfo} e 
     */
    replaceUserInfo:async function (e) {
      let rawInfo = e.detail.userInfo;
      console.log(rawInfo)
      await this.setUserProfile({
        name : rawInfo.nickName,
      });
    },

    /**
     * 
     * @param {WechatMiniprogram.Input} e 
     */
    replacePhone:async function (e) {
      let rawPhone = e.detail.value;
      await this.setUserProfile({
        phone : Number(rawPhone),
      });
    },

    /**
     * 
     * @param {WechatMiniprogram.Input} e 
     */
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
        url:app.globalData.server + "/user",
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
    onShow: async function () {
      await app.getUserInfo();
      this.setData({
        user:app.globalData.userInfo,
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     * 离开页面后刷新全局用户状态
     */
    onHide: async function () {
      await app.getUserInfo();
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