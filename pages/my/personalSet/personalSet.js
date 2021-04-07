// @ts-check pages/my/personalSet/personalSet.js
// TODO: 通过微信平台获取电话号码
// TODO: 向用户请求权限，并维护全局用户信息
import { request } from "../../../libs/request.js";
import { User } from "../../../libs/data.d.js";
import { compareVersion } from "../../../libs/compareVersion.js";
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    editable:true,
    /** @type {User} */
    user:null,
  },
  methods:{
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
    },
    /**
     * 获取明文编码的用户信息，受 {@link wx.getUserInfo} 接口变化的影响，只对旧版本小程序有效
     * @param {WechatMiniprogram.ButtonGetUserInfo} e 
     */
    replaceUserInfo:async function (e) {
      if(compareVersion(app.systemInfo.SDKVersion,"2.10.4") == -1){
        let rawInfo = e.detail.userInfo;
        console.log(e);
        await this.setUserProfile({
          name : rawInfo.nickName,
        });
      }else{
        // 新版本忽略此调用，由bindtap处理
      }
    },
    /**
     * 获取明文编码的用户信息，受 {@link wx.getUserInfo} 接口变化的影响，只对旧版本小程序有效
     * @param {WechatMiniprogram.Touch} e 
     */
    replaceUserProfile:async function (e) {
      if(compareVersion(app.systemInfo.SDKVersion,"2.10.4") == -1){
      }else{
        // 新版本调用getUserProfile
        try{
          let {userInfo} = await wx.getUserProfile({
            desc: '预约房间需要提供真实姓名',
          });
          await this.setUserProfile({
            name : userInfo.nickName,
          });

        }catch(e){
          if(e.errMsg.search("fail auth")){
            // 静默处理拒绝授权
          }else{
            // 重新抛出错误，供全局捕获
            throw e;
          }
        }
      }
    },
    /**
     * 从文本框获取预约人姓名
     * @param {WechatMiniprogram.Input} e 
     */
    replaceUserName:async function (e) {
      let rawName = e.detail.value;
      await this.setUserProfile({
        name : rawName,
      });
    },
    /**
     * 
     * @param {WechatMiniprogram.Input} e 
     */
    replacePhone:async function (e) {
      let rawPhone = e.detail.value;
      await this.setUserProfile({
        phone : String(rawPhone),
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
    /** @param {Partial< User | WechatMiniprogram.UserInfo>} userInfo*/
    async setUserProfile(userInfo){
      //TODO: 电话号码校验
      let newInfo = {
        ...this.data.user,
        ...userInfo,
      }
      this.setData({
        user: newInfo ,
      })
      let res = await request({
        url:app.globalData.server + "/user",
        header:app.globalData.APIHeader,
        method:"POST",
        data: newInfo,
      })
      app.globalData.userInfo = newInfo;
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