import { request } from "../../../libs/request.js";
const app = getApp();
const mapping = {
  new : "新请求",
  onhold : "处理中",
  receive : "已通过，待签到",
  reject : "已拒绝",
  cancel : "已取消",
}
const allowedStatus = new Set([
  'new','receive','signed','illegal','missed'
])
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
    let res = await request({
      url : app.globalData.server + "/appointment/cancel/" + dataset.id,
      header : app.globalData.APIHeader ,
      method : "PUT",
    })
    if(res.data.code > 299 || res.data.code < 200){
      wx.showToast({
        title: '撤销预约失败',
        icon: 'error',
        duration: 1500,
      })
    }else{
      wx.showToast({
        title: '撤销预约成功',
        icon: 'success',
        duration: 1500,
      })
      await this.refresh()
    }
  },
  refresh:async function(){
    //TODO: 前端实现带缓存的API系统后，将下列代码全部改为缓存读
    // /** @type {WechatMiniprogram.RequestSuccessCallbackResult} */
    // let scheduleRes = await request({
    //   url: app.globalData.server + '/schedule/all',
    //   header: app.globalData.APIHeader,
    //   method:"GET",
    // })
    // /** @type {Array} */
    // let schedule = scheduleRes.data.data.timeList;
    //加载预约列表
    let res = await request({
      url: app.globalData.server + "/appointment/username/"+app.globalData.openid,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    /** @type {Array<any>} */
    let apList = res.data.data.appointments;
    apList = apList.filter(
      (v) => allowedStatus.has(v.status)
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
        roomMap.set(i,roomNameRes.data.data.roomInfo.name);
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
        userMap.set(i,roomNameRes.data.data.userInfo.name);
      }catch(e){
        userMap.set(i,"用户未找到");
      }
    }
    //适配前端属性名
    for(let i of apList){
      i.roomName = roomMap.get(i.roomId);
      i.yyrxm = userMap.get(i.launcher);
      i.yyzt = mapping[i.status];
      let dateO =  new Date(i.execDate);
      i.yysj = dateO.toLocaleDateString("zh-cn");
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
  }
})
