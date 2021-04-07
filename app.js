// @ts-check app.js
import {request} from  "./libs/request.js";
import { User } from "./libs/data.d.js";
App({
  async onLaunch() {
    this.globalData.userInfoP = this.initialize();
  },
  onError(e) {
    this.errorHandler(e);
  },
  onUnhandledRejection(e){
    this.errorHandler('' + e.reason.errMsg + e.reason.stack);
  },

  /**
   * 
   * @param {string} errorMsg 
   */
  errorHandler(errorMsg){
    wx.hideLoading();
    wx.showToast({
      title:"系统出错！",
      icon:"error",
    })
    //处理终结性错误
    if(errorMsg.search("Failed to login") > -1){
      console.error("终结性错误")
      // await wx.redirectTo({
      //   url: '/pages/fatalError',
      // })
    }
    //await wx.reportAnalytics('bug',{message:e});
  },
  /**
   * 工具方法，异步执行业务数据加载操作。加入此函数是方便全局获取初始化状态，存入userInfoP。
   */
  async initialize(){
    // 登录
    let weixincode = await wx.login()
    // 小程序基础库版本2.10.2开始支持异步Promise调用
    // wx.request仍然需要手动封装
    // 发送 weixincode.code 到后台换取 openId, sessionKey, unionId'
    try{
      let session = await request({
        url:this.globalData.server + "/user/login?code="+weixincode.code,
        method:"GET",
      })
      if(session.data.code<200 || session.data.code>=300){
        throw new Error()
      }
      this.globalData.APIHeader.token = session.data.data.token;
      this.globalData.openid = session.data.data.openid;
    }catch(e){
      // 修改有问题的报错信息。 TODO: 修改错误类型
      throw new Error("Failed to login");
    }
    this.systemInfo = await wx.getSystemInfo();
    // 获取微信用户信息，获取完成后使得userInfoP字面量完成，此处await关键字不能删除
    await this.getUserInfo();
  },
  async getUserInfo(){
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以将此函数实现为异步函数，await 函数值即可等待函数执行完毕，返回用户信息
    // await 可以使得控制流停止，等待网络请求完成
    let appUserInfo = await request({
      url:this.globalData.server + "/user/"+this.globalData.openid,
      header:this.globalData.APIHeader,
      method:"GET",
    })
    /** @type {User & WechatMiniprogram.UserInfo} */
    let userInfo = appUserInfo.data.data.userInfo
    // 可以将 res 发送给后台解码出 unionId
    let settingsRes = await wx.getSetting()
    if (settingsRes.authSetting['scope.userInfo']) {
      /** @type {WechatMiniprogram.GetUserInfoSuccessCallbackResult} 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 */ 
      let userInfoRes = await wx.getUserInfo({})
      // 可以将 res 发送给后台解码出 unionId
      userInfo.avatarUrl = userInfoRes.userInfo.avatarUrl
    }
    this.globalData.userInfo = userInfo;
    this.globalData.userInfoComplete 
      = Boolean(userInfo.phone) 
      && Boolean(userInfo.organization) 
      && Boolean(userInfo.name)
    ;
    return userInfo;
  },
  globalData: {
    openid:"",
    APIHeader: {
      "content-type":"application/json",
      "token":null,
    },
    userInfo: null,
    /** 
     * @type {Promise<void>} 小程序是否加载完成
     */
    userInfoP:null,
    userInfoComplete:false,
    server: "https://api-dev.bitrxc.com"
  },
  /**@type {WechatMiniprogram.SystemInfo} */
  systemInfo:null,
})
