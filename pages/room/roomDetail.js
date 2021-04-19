// @ts-check pages/room/roomDetail.js
import { request } from "../../libs/request.js";
import { APIResult, Room } from "../../libs/data.d.js";
const app = getApp();
const iconMap = new Map([
  ["垫子板凳","chair.png"],
  ["投影","medio.png"],
  ["桌椅","desk.png"],
  ["多媒体","medio.png"],
  ["坐垫","chair.png"],
  ["阶梯长椅","chair.png"],
  ["桌游","poker.png"],
  ["健身器材","FitEq.png"],
  ["棋类道具","games.png"],
  ["坐垫","cushion.png"]
])
Page({
  /**
   * 页面的初始数据
   */
  data: {
    area:12,
    pnum:15,
    roomId:NaN,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    await app.globalData.userInfoP;
    this.data.roomId = Number(options.roomID);
    let res = await request({
      url: app.globalData.server + '/room/'+this.data.roomId,
      header: getApp().globalData.APIHeader,
      method:"GET",
    })
    /** @type {Room & {area:string,capacity:number,descObj:Record<string,any>, gallery:Array<any>,facilities:Array<{label:string,img:string}>}} */
    let room = APIResult.checkAPIResult(res.data).roomInfo;
    console.log(room)
    room.gallery = [];
    if(typeof room.image == "string" && room.image.length > 0){
      room.gallery.push(
        {
          image:room.image,
          url:"",
        }
      );
    }
    if(room.gallery.length==0){
      room.gallery.push(
        {
          image:"/pages/room/img/123.jpg",
          url:"",
        }
      );
    }

    room.descObj = JSON.parse(room.description)
    if(room.descObj["图库"] instanceof Array){
      //TODO:后端没有封装相册
    }

    room.area = room.descObj["面积"];
    room.capacity = Number(room.descObj["容纳人数"]);

    let facilities = [];
    if(room.descObj["设备情况"] instanceof Array){
      facilities = room.descObj["设备情况"];
    }else if(typeof room.descObj["设备情况"] == "string"){
      facilities = room.descObj["设备情况"].split("、");
    }
    facilities = facilities.map((val)=>{
      let img = iconMap.get(val) || "";
      return {
        label:val,
        img:img
      }
    });
    room.facilities = facilities;

    if(room.descObj["承载功能"]){
      room.description = room.descObj["承载功能"];
    }else{
      room.description = "暂无描述";
    }
    this.setData({
      room:room
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
  onShow:async function(){
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
      url: './room1/room1?roomId='+this.data.roomId,
    })
  }
})