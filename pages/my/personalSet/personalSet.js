// @ts-check pages/my/personalSet/personalSet.js
// TODO: 通过微信平台获取电话号码
// TODO: 向用户请求权限，并维护全局用户信息
import { delay, request } from "../../../libs/request.js";
import { APIResult, User } from "../../../libs/data.d.js";
import { compareVersion } from "../../../libs/compareVersion.js";
import { APIError } from "../../../libs/errors.d.js";

/** 
 * 
 * @typedef {Object} FunctionalItem 
 * @property {string} placeholder
 * @property {string} title 
 * @property {string} cache
 * @property { (ipt:string) => boolean } validator
 * 
 */
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    note:'',
    /** @type {Record<string,FunctionalItem>} */
    functions:{
      name:{
        placeholder:'请输入姓名',
        title:'姓名',
        cache:'',
        validator : (ipt)=>{return Boolean(ipt) && ipt.length>0},
      },
      schoolId:{
        placeholder:'请输入学号/工号',
        title:'学号/工号',
        cache:'',
        validator : (ipt)=>{return Boolean(ipt) && ipt.length==10},
      },
      organization:{
        placeholder:'请输入书院/学院',
        title:'书院/学院',
        cache:'',
        validator : (ipt)=>{return Boolean(ipt) && ipt.length>0},
      },
      phone:{
        placeholder:'请输入电话号码',
        title:'联系电话',
        cache:'',
        validator : (ipt)=> {
          const phonePattern = RegExp("^1(3\\d{2}|4[14-9]\\d|5([0-35689]\\d|7[1-79])|66\\d|7[2-35-8]\\d|8\\d{2}|9[13589]\\d)\\d{7}$");
          return phonePattern.test(ipt)
        },
      },
    },
      
    editable:false,
    /** @type {User} */
    user:app.globalData.userInfo,
  },
  methods:{
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
    },
    enableEdit(e){
      this.setData({
        editable:true,
      })
      //初始化缓存
      for(let index in this.data.functions){
        let functionItem = this.data.functions[index];
        functionItem.cache = this.data.user[index]
      }
    },
    async disableEdit(e){
      this.setData({
        editable:false,
      })
      await this.saveUserProfile();
    },
    /**
     * @param {WechatMiniprogram.Input<any,{index:string}>} e
     */
    cacheItem(e){
      let index = e.currentTarget.dataset.index;
      this.data.functions[index].cache = e.detail.value;
      return e.detail.value;
    },
    /**
     * @deprecated
     * @param {WechatMiniprogram.InputBlur<any,{index:string}>} e
     */
    async saveItem(e){
    },
    
    /**
     * 获取明文编码的用户信息，受 {@link wx.getUserInfo} 接口变化的影响，只对旧版本小程序有效
     * @param {WechatMiniprogram.ButtonGetUserInfo} e 
     */
    replaceUserInfo:async function (e) {
      if(compareVersion(app.systemInfo.SDKVersion,"2.10.4") == -1){
        let rawInfo = e.detail.userInfo;
        console.log(e);
        await this.saveUserProfile();
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
          //TODO : 将用户信息存入缓存
          await this.saveUserProfile();

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
     * @returns {Promise<void>}
     */
    async saveUserProfile(){
      let newInfo = {
        ...this.data.user,
      }
      let note = "";
      //读缓存
      for(let index in this.data.functions){
        let functionItem = this.data.functions[index];
        if(functionItem.validator(functionItem.cache)){
          newInfo[index] = functionItem.cache
        }else{
          note += functionItem.title + "格式不正确"
        }
      }
      try{
        let res = await request({
          url:app.globalData.server + "/user",
          header:app.globalData.APIHeader,
          method:"POST",
          data: newInfo,
        })
        APIResult.checkAPIResult(res.data);
        this.setData({
          user: newInfo ,
          note:note,
        })
        app.getUserInfo();
      }catch(e){
        await wx.showToast({
          icon:'error',
          title: '用户信息保存失败',
        });
        await delay(2000);
        await wx.hideToast({})
        throw e
      }
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