// @ts-check pages/room/room1/room1.js
/* 
 * TODO: 服务端处理时区问题
 */
import { delay, request } from "../../../libs/request.js";
import { APIResult, Schedule,Deal } from "../../../libs/data.d.js";

/**
 * @typedef {{zt:string,color:number}} tagType
 */
const profile = {
  /** 
   * 第一周的星期一 
   * TODO: 从服务段读取此字段
   */
  weekbegin : Date.parse("2021-02-28"),
  /** @enum {tagType} */
  statusMap : {
    past : {
      zt : "来晚了",
      color : -1,
    },
    avaliable : {
      zt : "可预约",
      color : 1,
    },
    unreachable : {
      zt : "未开放",
      color : 0,
    },
    occupied : {
      zt : "已预约",
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
const app = getApp()
Page({
  data: {
    /** @type {Promise<void>} */ 
    inited:null,
    /** @type {dealSegmentItemType} */
    cardView: null,
    roomId:NaN,
    inputValue:"",
    roomName: "",
    show: false,
    weekList: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    week: 8,
    day: ['一','二','三','四','五','六','日'],
    /** @type {Array<Schedule>}*/
    schedule : [],
    /** @type {Array<dealSegmentItemType>} */
    wlist: [],

    twoblocks:false,

    items: [
      {value: '1', name: 'one',checked: 'true'},
      {value: '2', name: 'two'},
    ]    
  },


  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      items
    });
    if( e.detail.value == 1){
      this.setData({
        twoblocks:false
      });
      console.log('twoblocks值为：', this.data.twoblocks);

    }
    if( e.detail.value == 2){
      this.setData({
        twoblocks:true
      });
      console.log('twoblocks值为：', this.data.twoblocks);

    }
    
  },


  /**
   * 检查用户填写的内容
   * 提交表单中用户填写的内容
   * 更新视图
   * @param {WechatMiniprogram.FormSubmit} e
   */
  formSubmit:async function (e) {
    if (e.detail.value.usefor.length == 0) {
      await wx.showToast({
        title: '用途不能为空!',
        icon:"none",
        duration: 1500
      })
      await delay(2000);
      await wx.hideToast();
    } else {
      let apInfo = this.data.cardView;
      let execDate = new Date(apInfo.execDate);
      try{
        let res = await request({
          url : app.globalData.server + "/appointment/appoint",
          header : app.globalData.APIHeader ,
          method : "POST",
          data : {
            roomId : this.data.roomId,
            launcher : app.globalData.userInfo.username,
            launchTime : apInfo.yysd,
            execDate : execDate.toISODateString(),
            launchDate : Date.now(),
            userNote : e.detail.value.usefor,
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
      //刷新预约时段所在列
      let list = await this.fetchColumn(execDate);
      let dayNow = (execDate.getDay()+6) % 7+1;
      list = list.concat(
        //将待刷新的列的旧成员移除
        this.data.wlist.filter((v)=> v.xqj != dayNow)
      );
      this.setData({
        wlist:list,
      })
      await wx.showToast({
        /* title: '预约成功！',//这里打印出登录成功
        icon: 'success', */
        title: '预约无效！',
          icon: 'loading',
        duration: 1000,
      })
      //播放动画，关闭
      this.hideModal();

      //根据是否可以继续预约判断，留在当前页面，还是跳转到预约进度页面，多次预约
      switch(await app.checkDealable()){
        case 'ok':
          break;
        default:
          await wx.navigateTo({ 
            url: '../../my/process/process?continue=false',
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
   * 初始化页面标题，初始化预约时间列表
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

    let scheduleRes = await request({
      url: app.globalData.server + '/schedule/all',
      header: app.globalData.APIHeader,
      method:"GET",
    })

    let dateNow = new Date()
    let weekNow =  Math.ceil(
      (dateNow.getTime() - profile.weekbegin) / 
      (7  * 24 * 60 * 60 * 1000 ) 
    )
    await this.setData({
      windowHeight: app.systemInfo.windowHeight,
      roomName: room.name,
      schedule : APIResult.checkAPIResult(scheduleRes.data).timeList,
      week : weekNow,
    })
  },
  onShow:async function(){
    switch(await app.checkDealable()){
      case 'ok':
        await this.data.inited;
        await this.refreshTable(new Date());
        await wx.hideLoading();
        break;
      case 'toomuch':
        await wx.navigateBack();
        break;
      case 'imcomplete':
        await wx.navigateBack();
    }
  },
  /** 
   * @param {Date} date 需要查询的周次
   */
  refreshTable : async function(date){
    date.setDate(date.getDate() - (date.getDay() + 6)%7);
    /** @type {Array<Promise>} */
    let operations = [];
    for(let i = 0;i<7;i++){
      let newDate = new Date(date.getTime());
      newDate.setDate(newDate.getDate() + i);
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
   * @param {Date} date 需要查询的日期
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
    let weekNow =  Math.floor(
      (date.getTime() - profile.weekbegin) / 
      (7  * 24 * 60 * 60 * 1000 ) 
    ) 
    let dayNow = (date.getDay()+6)%7 +1;
    if(dayNow == 7){
      weekNow = weekNow -1;
    }
    let resWlist  = [];
    for(let item of schedule){
      let res= {
        "djz": weekNow , 
        "xqj": dayNow , 
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
    this.setData({
      week: week
    })
    let dateNow = new Date(profile.weekbegin);
    dateNow.setDate(dateNow.getDate() + 7 * week);
    this.refreshTable(dateNow);
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
    if(e.currentTarget.dataset.wlist.color === 1){
      this.setData({
        cardView: cardView,
        userName: app.globalData.userInfo.name,
        //展示对话框
        showModalStatus: true,
      });
    }
  },
  async hideModal() { //点击弹框外空白处收起弹框(取消按钮相同)
    await delay(200);
    this.setData({
      showModalStatus: false
    });
  },
});
( () => {
  function pad(number) {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }
  /**
   * @function Date#toISODateString
   * @returns {string}
   */
  Date.prototype.toISODateString = function() {
    return this.getUTCFullYear() +
      '-' + pad( this.getUTCMonth() + 1 ) +
      '-' + pad( this.getUTCDate() ) ;
  };
} )();