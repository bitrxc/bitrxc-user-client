// @ts-check
import { APIResult,Deal ,Schedule} from "../../../libs/data.d.js";
import { EnhancedDate } from "../../../libs/EnhancedDate.js";
import { request } from "../../../libs/request.js";
/** @type {import("../../../app.js").MiniprogramContext} */
const app = getApp();
Page({
  data: {
    dayList: [//yysj表示预约时间，roomName表示房间名字，yyrxm表示预约人姓名，rs表示使用人数，ytsm表示用途说明，yyzt表示预约状态
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
      { "yysj": "第8周 周一 08：00-10：00", "roomName": "党建活动室", "yyrxm": "张三", "rs": "2", "ytsm": "自习讨论", "yyzt": "成功"},
    ]
  },
  onLoad:async function (options) {
    await app.globalData.userInfoP;
  },
  onShow:async function (){
    await app.globalData.userInfoP;
    await this.refresh()
  },
  /**
  * @param {WechatMiniprogram.BaseEvent} event 
  */
  cancel:async function (event) {
    let dataset = event.currentTarget.dataset;
    try{
      let res = await request({
        url : app.globalData.server + "/appointment/cancel/" + dataset.id,
        header : app.globalData.APIHeader ,
        method : "PUT",
      })
      APIResult.checkAPIResult(res.data)
      wx.showToast({
        title: '撤销预约成功',
        icon: 'success',
        duration: 1500,
      })
      await this.refresh()
    }catch(e){
      wx.showToast({
        title: '撤销预约失败',
        icon: 'error',
        duration: 1500,
      })
    }
  },
  refresh:async function(){
    //TODO: 前端实现带缓存的API系统后，将下列代码全部改为缓存读
    //加载预约列表
    let res = await request({
      url: app.globalData.server + "/appointment/username/"+app.globalData.openid,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** @type {Array<Deal>} */
    let apList = APIResult.checkAPIResult(res.data).appointments;
    apList = apList.filter(
      (v) => Deal.allowedStatus.has(v.status)
    ).sort(
      (a,b)=> {
        let aDate = Date.parse(a.execDate) ;
        let bDate = Date.parse(b.execDate) ;
        if(aDate < bDate){
          return 1;
        }else if(aDate == bDate){
          return 0;
        }else{
          return -1;
        }
      }
    );
    //为什么有两段相似代码？API URL入口点、被映射的属性名和API数据的存储位置都需要定制，复杂度过高。
    /** 提取房间Id
     * @type {Map<number,string>} */
    let roomMap = new Map();
    for(let i of apList){
      roomMap.set(i.roomId,"");
    }
    //加载涉及到的房间名称
    //BUG: 房间和用户有可能不存在，此时应该忽略不存在的房间
    for(let [i,] of roomMap){
      try{
        let roomNameRes = await request({
          url: app.globalData.server + "/room/"+i,
          header: app.globalData.APIHeader,
          method:"GET",
        })
        roomMap.set(i,APIResult.checkAPIResult(roomNameRes.data).roomInfo.name);
      }catch(e){
        roomMap.set(i,"房间未找到");
      }
    }
    /** 提取用户Id
     * @type {Map<string,string>} */
    let userMap = new Map();
    for(let i of apList){
      userMap.set(i.launcher,"");
    }
    //加载涉及到的用户名称
    for(let [i,] of userMap){
      try{
        let roomNameRes = await request({
          url: app.globalData.server + "/user/" +i,
          header: app.globalData.APIHeader,
          method:"GET",
        })
        userMap.set(i,APIResult.checkAPIResult(roomNameRes.data).userInfo.name);
      }catch(e){
        userMap.set(i,"用户未找到");
      }
    }
    console.log(apList)
    let schedule = app.globalData.schedule;
    schedule.values
    //适配前端属性名
    for(let i of apList){
      i.roomName = roomMap.get(i.roomId);
      i.yyrxm = userMap.get(i.launcher);
      i.yyzt = app.globalData.appointmentStatus[i.status];
      i.cancelable = i.status == "new";
      let dateO =  new EnhancedDate({date:new Date(i.execDate)})
      i.week = dateO.week;
      i.weekDay = dateO.weekDay;
      if(i.begin == i.end){
        i.schedule = i.begin;
      }else{
        i.schedule = i.begin + "、" + i.end;
      }
      i.beginTime = schedule.get(i.begin).begin;
      i.endTime = schedule.get(i.begin).end;
      i.yysj = dateO.toLocaleDateString("zh-cn");
      i.rs = i.attendance
      /** @type {String} */
      let noteO = i.userNote;
      if(!noteO){
        noteO = "暂无说明"
      }
      noteO = noteO.substring(0,20);
      i.ytsm = noteO;
    }
    this.setData({
      windowHeight: app.systemInfo.windowHeight,
      dayList:apList
    })
  },
  tofunction: function (e) {
    wx.navigateTo({
      url: '../../room/signIn/signIn',
    })
  }
})
