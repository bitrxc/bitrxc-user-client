// @ts-check app.js
import {request} from  "./libs/request.js";
import { User } from "./libs/data.d.js";
App({
  async onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.userInfoP = this.initialize();
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
    let session = await request({
      url:this.globalData.server + "/user/login?code="+weixincode.code,
      method:"GET",
    })
    console.log(session.data);
    this.globalData.APIHeader.token = session.data.data.token;
    this.globalData.openid = session.data.data.openid;
    this.systemInfo = await wx.getSystemInfo();
    // 获取微信用户信息
    await this.getUserInfo();
    
    console.log(this.systemInfo.windowHeight)
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
      // console.log(userInfoRes.userInfo)
      userInfo.avatarUrl = userInfoRes.userInfo.avatarUrl
    }
    console.log(userInfo);
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
    server: "https://test.ruixincommunity.cn"
  },
  /**@type {WechatMiniprogram.SystemInfo} */
  systemInfo:null,
})
