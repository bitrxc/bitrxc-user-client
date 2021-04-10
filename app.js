// @ts-check app.js
import {request} from  "./libs/request.js";
import { APIResult, User,Deal } from "./libs/data.d.js";
App({
  async onLaunch() {
    this.globalData.userInfoP = this.initialize();
  },
  onError(e) {
    this.errorHandler('' + e);
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
      this.logger.error("终结性错误")
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
      let sessionRes = await request({
        url:this.globalData.server + "/user/login?code="+weixincode.code,
        method:"GET",
      })
      let session = APIResult.checkAPIResult(sessionRes.data);
      this.globalData.APIHeader.token = session.token;
      this.globalData.openid = session.openid;
    }catch(e){
      this.logger.info(e)
      // 修改有问题的报错信息。 TODO: 修改错误类型
      throw new Error("Failed to login");
    }
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
    let userInfo = APIResult.checkAPIResult(appUserInfo.data).userInfo
    this.globalData.userInfo = userInfo;
    //TODO: 管理员手动审核用户信息
    this.globalData.userInfoComplete 
      = Boolean(userInfo.phone) 
      && Boolean(userInfo.organization) 
      && Boolean(userInfo.name)
    ;
    return userInfo;
  },
  /**检查用户是否可以预约 */
  async checkDealable(){
    let res = await request({
      url: this.globalData.server + "/appointment/username/"+this.globalData.openid,
      header: this.globalData.APIHeader,
      method:"GET",
    })
    /** @type {Array<any>} */
    let apList = APIResult.checkAPIResult(res.data).appointments;
    apList = apList.filter(
      (v) => Deal.allowedStatus.has(v.status)
    );
    if(apList.length >= 4){
      return 'toomuch';
    }else{
      if(!this.globalData.userInfoComplete){
        return 'imcomplete'
      }else{
        return 'ok';
      }
    }
  },
  globalData: {
    openid:"",
    APIHeader: {
      "content-type":"application/json",
      "token":null,
    },
    /** @type {User & WechatMiniprogram.UserInfo} */
    userInfo: null,
    /** 
     * @type {Promise<void>} 小程序是否加载完成
     */
    userInfoP:null,
    userInfoComplete:false,
    server: "https://api-dev.bitrxc.com"
  },
  /**@type {WechatMiniprogram.SystemInfo} */
  systemInfo:wx.getSystemInfoSync(),
  logger:wx.getRealtimeLogManager(),
})
