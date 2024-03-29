// @ts-check pages/room/room1/room1.js
/* 
 * 
 */
import { delay, request } from "../../../libs/request.js";
import { APIResult, Schedule,Deal } from "../../../libs/data.d.js";
import { EnhancedDate } from "../../../libs/EnhancedDate.js";

/**
 * @typedef {{zt:string,color:number}} tagType
 */
const profile = {
  /** @enum {tagType} */
  statusMap : {
    past : {
      zt : "来晚了",
      color : -1,
    },
    avaliable : {
      zt : "空闲",
      color : 1,
    },
    unreachable : {
      zt : "未开放",
      color : 0,
    },
    occupied : {
      zt : "被预约",
      color : -1,
    },
    mine : {
      zt : "已预约",
      color : -2,
    },
  }
}
/**
 * @typedef {object} dealSegmentItemType
 * @property {number} djz 表示第几周
 * @property {number} xqj 表示星期几
 * @property {number} yysd 表示预约时段
 * @property {number} yycd 表示预约长度（固定为1）
 * @property {string} [zt] 表示房间状态
 * @property {number} [color] 用户已预约时段用-1表示，可预约时段用0表示，不可预约时段用-1表示
 * @property {number} execDate 预约的到期日期，为数值型
 */
/** @type {import("../../../app.js").MiniprogramContext} */
const app = getApp();
Page({
  data: {
    /** @type {Promise<void>} *///@ts-ignore
    inited:null,
    /** @type {dealSegmentItemType} */
    cardView: {djz:0,xqj:0,yysd:0,yycd:1,execDate:0},
    roomId:NaN,
    inputValue:"",
    roomName: "",
    show: false,
    dealable:false,
    weekList: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    week: 8,
    day: ['一','二','三','四','五','六','日'],
    /** @type {Array<Schedule>}*/
    schedule : [],
    maxSchedule : 6,
    twoblocks:false,
    /** @type {Array<dealSegmentItemType>} */
    wlist: [],
    /** 多选框的选项 */
    items: [
      {value: 0, name: '1',checked: 'true'},
      {value: 1, name: '2'},
    ]
  },
  radioChange(e) {
    if( e.detail.value == 0){
      this.setData({
        twoblocks:false
      });
    }else if( e.detail.value == 1){
      this.setData({
        twoblocks:true
      });
    }
    
  },
  /**
   * 检查用户填写的内容
   * 提交表单中用户填写的内容
   * 更新视图
   * @param {WechatMiniprogram.FormSubmit &
   *  {detail:{value:
   *    {duration:string,attendence:string,usefor:string,requires:string[]}}}} e
   */
  formSubmit:async function (e) {
    console.log(e)
    let form = e.detail.value;
    if (form.usefor.length == 0) {
      await wx.showToast({
        title: '用途不能为空!',
        icon:"none",
        duration: 1500
      })
      await delay(2000);
      await wx.hideToast({});
    } else if(isNaN(Number(form.attendence) )){
      await wx.showToast({
        title: '人数格式错误!',
        icon:"none",
        duration: 1500
      })

    } else {
      let apInfo = this.data.cardView;
      let execDate = new EnhancedDate({time:apInfo.execDate});
      let endSegment = apInfo.yysd + Number(form.duration) ;
      let requires = new Set(form.requires)
      if(requires.has('airConditioner')){
        form.usefor += '\n\r 使用器材：空调'
      }
      
      if(requires.has('medio')){
        form.usefor += '\n\r 使用器材：投影仪'
      }
      try{
        let res = await request({
          url : app.globalData.server + "/appointment/appoint",
          header : app.globalData.APIHeader ,
          method : "POST",
          data : {
            roomId : this.data.roomId,
            launcher : app.globalData.userInfo.username,
            begin : apInfo.yysd,
            end : endSegment,
            attendance : Number(form.attendence),
            execDate : execDate.toISODateString(),
            launchDate : Date.now(),
            userNote : form.usefor,
          }
        })
        APIResult.checkAPIResult(res.data)
      }catch(e){
        await wx.showToast({
          title: '提交失败！',
          icon: 'loading',
          duration: 1500,
        })
        return;
      }
      // 发送预约审批通知
      // 管理员预约通知由书院拨打电话发送
      wx.requestSubscribeMessage({
        tmplIds: ['F5-LCFCIXt04AY0WPSC0vJAQsjyFXOn2vltNKXs5ABQ']        
      })
      //刷新预约时段所在列
      let list = await this.fetchColumn(execDate);
      let dayNow = execDate.weekDay;
      list = list.concat(
        //将待刷新的列的旧成员移除
        this.data.wlist.filter((v)=> v.xqj != dayNow)
      );
      this.setData({
        wlist:list,
      })
      await wx.showToast({
        title: '提交成功！',
        icon: 'success',
        duration: 1000,
      })
      //播放动画，关闭
      this.hideModal();

      //根据是否可以继续预约判断，留在当前页面，还是跳转到预约进度页面，多次预约
      switch(await app.checkDealable()){
        case 'ok':
          break;
        default:
          this.setData({
            dealable:false
          })
      }
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载预约列表',
    })
    let roomId = Number(options.roomId)
    this.data.roomId = roomId;
    this.data.inited = this.prefetch(roomId);
  },
  /**
   * 初始化页面标题，房间信息，初始化预约时间列表
   * @param {number} roomId
   */
  prefetch:async function (roomId){
    await app.globalData.userInfoP;
    let roomRes = await request({
      url: app.globalData.server + '/room/'+roomId,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let room = APIResult.checkAPIResult(roomRes.data).roomInfo;

    let schedule = Array.from(app.globalData.schedule.values());
    let dateNow = new EnhancedDate({time:Date.now()})
    let dateBegin = new EnhancedDate(dateNow)
    dateBegin.weekDay = 1;
    let dateEnd = new EnhancedDate(dateNow)
    dateEnd.weekDay = 7;
    await this.setData({
      windowHeight: app.systemInfo.windowHeight,
      roomName: room.name,
      schedule,
      maxSchedule : schedule[schedule.length-1].id,
      week : dateNow.week,
      dateBegin : dateBegin.toISODateString(),
      dateEnd : dateEnd.toISODateString(),
      weekList : [dateNow.week,dateNow.week+1]
    })
  },
  onShow:async function(){
    await this.data.inited;
    await this.refreshTable(new EnhancedDate({time:Date.now()}));
    switch(await app.checkDealable()){
      case 'ok':
        this.setData({
          dealable:true
        })
        break;
      case 'toomuch':
        break;
      case 'imcomplete':
    }
    await wx.hideLoading();
  },
  /** 
   * @param {EnhancedDate} date 需要查询的周次
   */
  refreshTable : async function(date){
    /** @type {Array<Promise>} */
    let operations = [];
    for(let i = 1;i<=7;i++){
      let newDate = new EnhancedDate({date});
      newDate.weekDay = i;
      operations.push(this.fetchColumn(newDate))
    }
    let results = await Promise.all(operations);
    let resWlist = results.reduce(
      (prev,cur) => prev.concat(cur) ,
    [])
    this.setData({
      wlist:resWlist,
    })
  },
  /** 
   * @param {EnhancedDate} date 需要查询的日期
   * @returns {Promise<Array<dealSegmentItemType>>}
   */
  fetchColumn :async function (date) {
    //url构造器，微信小程序不支持Web URL规范，此处还要用
    let urlBuilder = app.globalData.server +
      '/room/free/time' + '?' +
      'roomId' + '=' + this.data.roomId + '&' +
      'username' + '='  + app.globalData.userInfo.username + '&' +
      'date' + '='  + date.toISODateString();
    let listRes = await request({
      url: urlBuilder,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let listData = APIResult.checkAPIResult(listRes.data);
    /**
     * 
     * @param {Array<{id:any,tag?:tagType}>} resList 
     * @param {Array<{id:any}>} externList 
     * @param {tagType} tag 
     */
    function marker(resList,externList,tag){
      for(let i of resList){
        if (
          externList.some((v)=>  v.id === i.id )
        ) {
          i.tag = tag;
        }
      }
    };
    /** @type {Array<Schedule & {tag?:tagType}>}*/
    let schedule = Array.from(this.data.schedule)
    marker(schedule ,
      listData.freeTime,
      profile.statusMap.avaliable
    );
    marker(schedule ,
      listData.passTime,
      profile.statusMap.past
    );
    marker(schedule ,
      listData.myTime,
      profile.statusMap.mine
    );
    marker(schedule ,
      listData.busyTime,
      profile.statusMap.occupied
    );
    let resWlist  = [];    
    for(let item of schedule){
      let res= {
        "djz": date.week , 
        "xqj": date.weekDay , 
        "yysd": item.id ,
        "yycd": 1,
        "execDate":date.getTime() ,
      };
      res = Object.assign(res,item.tag);
      resWlist.push(res);
    }
    return resWlist;
  },
  clickShow: function (e) { //显示或隐藏周下拉菜单
    this.setData({
      show: !this.data.show,
    })
  },
  clickHide: function (e) { //隐藏周下拉菜单
    this.setData({
      show: false
    })
  },
  /** 
   * 选择周数
   * @param {WechatMiniprogram.TouchEvent<any,any,{week:number}>} e
   */
  selectWeek: function (e) {
    
    let week = e.target.dataset.week;
    let dateBegin = new EnhancedDate({week,weekDay:1});
    let dateEnd = new EnhancedDate({week,weekDay:7});
    this.setData({
      dateBegin: dateBegin.toISODateString(),
      dateEnd: dateEnd.toISODateString(),
      week: week
    })
    this.refreshTable(dateBegin);
  },

  stopTouchMove: function () {
    return false;
  },
  /** 
   * 点击可预约区域，检查用户资质，向符合预约资质的用户弹框显示预约信息
   * @param {WechatMiniprogram.TouchEvent<any,any,{wlist:dealSegmentItemType}>} e
   */
  showCardView: function (e) {
    let cardView = e.currentTarget.dataset.wlist;
    if(cardView.color === 1&&this.data.dealable){
      let cardChoices = [
        {value: 0, name: '1',checked: 'true'},
        {value: 1, name: '2'},
      ]
      if(cardView.yysd == this.data.maxSchedule){
        cardChoices = [
          {value: 0, name: '1',checked: 'true'},
        ]
      }
      this.setData({
        cardView: cardView,
        userName: app.globalData.userInfo.name,
        //展示对话框
        showModalStatus: true,
        items:cardChoices
      });
    }
  },
  async hideModal() { //点击弹框外空白处收起弹框(取消按钮相同)
    await delay(200);
    this.setData({
      showModalStatus: false
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:async function () {
    await this.data.inited;
    await this.onShow()
    await wx.stopPullDownRefresh()
  }
});
