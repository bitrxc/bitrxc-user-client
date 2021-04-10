// @ts-check pages/my/personalSet/personalSet.js
// TODO: 通过微信平台获取电话号码
// TODO: 向用户请求权限，并维护全局用户信息
import { delay, request } from "../../../libs/request.js";
import { APIResult, User } from "../../../libs/data.d.js";
import { compareVersion } from "../../../libs/compareVersion.js";
import { APIError } from "../../../libs/errors.d.js";
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    editable:false,
    /** @type {User} */
    user:app.globalData.userInfo,
    status:{
      phone:"未修改",
      name:"",
      organization:"",
    }
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
    },
    disableEdit(e){
      this.setData({
        editable:false,
      })
      this.saveUserProfile({});
    },
    /**
     * 获取明文编码的用户信息，受 {@link wx.getUserInfo} 接口变化的影响，只对旧版本小程序有效
     * @param {WechatMiniprogram.ButtonGetUserInfo} e 
     */
    replaceUserInfo:async function (e) {
      if(compareVersion(app.systemInfo.SDKVersion,"2.10.4") == -1){
        let rawInfo = e.detail.userInfo;
        console.log(e);
        await this.saveUserProfile({
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
          await this.saveUserProfile({
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
      if(rawName.length>0){
        await this.saveUserProfile({
          name : rawName,
        });
      }else{
        this.setData({
          user:{
            ...this.data.user
          }
        })
      }
    },
    /**
     * 
     * @param {WechatMiniprogram.Input} e 
     */
    replacePhone:async function (e) {
      let rawPhone = e.detail.value;
      const phonePattern = RegExp("^1(3\\d{2}|4[14-9]\\d|5([0-35689]\\d|7[1-79])|66\\d|7[2-35-8]\\d|8\\d{2}|9[13589]\\d)\\d{7}$");
      // 电话号码校验
      if(phonePattern.test(rawPhone)){
        try{
          await this.saveUserProfile({
            phone : String(rawPhone),
          });
        }catch(e){
          this.setData({
            status:{
              ...this.data.status,
              phone:"未成功修改电话号码",
            },
            user:{
              ...this.data.user,
            }
          })
        }
        this.setData({
          status:{
            ...this.data.status,
            phone:"修改成功",
          }
        })
      }else{
        this.setData({
          status:{
            ...this.data.status,
            phone:"电话号码格式不正确",
          },
          user:{
            ...this.data.user,
          }
        })
      }
      await delay(2000);
      this.setData({
        status:{
          ...this.data.status,
          phone:"未修改",
        }
      });
    },
    activatePhone(){
      this.setData({
        status:{
          ...this.data.status,
          phone:"修改中",
        }
      })

    },
    /**
     * 
     * @param {WechatMiniprogram.Input} e 
     */
    replaceOrg:async function (e) {
      let rawOrg = e.detail.value;
      if(rawOrg.length>0){
        await this.saveUserProfile({
          organization : rawOrg,
        });
      }else{
        this.setData({
          user:{
            ...this.data.user
          }
        })
      }
    },
    /** 
     * @param {Partial< User | WechatMiniprogram.UserInfo>} userInfo
     * @returns {Promise<void>}
     */
    async saveUserProfile(userInfo){
      let newInfo = {
        ...this.data.user,
        ...userInfo,
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
        })
        app.getUserInfo();
      }catch(e){
        await wx.showToast({
          title: '用户信息保存失败',
        });
        await delay(2000);
        await wx.hideToast()
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