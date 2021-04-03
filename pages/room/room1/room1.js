// @ts-check pages/room/room1/room1.js
/* 
 * TODO: 服务端处理时区问题
 */
import { request } from "../../../libs/request.js";
import { Schedule } from "../../../libs/data.d.js";


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
 * @property {number} [execDate] 预约的到期日期，为数值型
 */
const app = getApp()

Page({
  data: {
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
    wlist: [
      {"djz":8, "xqj": 4, "yysd": 2, "yycd": 1, "zt": "已预约",  "color": 1 }, 
      {"djz":8,  "xqj": 1, "yysd": 2, "yycd": 1, "zt": "可预约",  "color": 0 },
      {"djz":8,  "xqj": 2, "yysd": 1, "yycd": 1, "zt": "可预约",  "color": 0 }, 
      {"djz":8, "xqj": 1, "yysd": 1, "yycd": 1, "zt": "来晚了",  "color": -1 },
    ],
  },

  /**
   * 检查用户填写的内容
   * 提交表单中用户填写的内容
   * 更新视图
   * @param {WechatMiniprogram.FormSubmit} e
   */
  formSubmit:async function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    /*暂时不检查人数和姓名
    if (e.detail.value.name.length == 0) {

      wx.showToast({
        title: '姓名不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else if (e.detail.value.number.length == 0) {

      wx.showToast({
        title: '人数不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else */if (e.detail.value.usefor.length == 0) {

      await wx.showToast({
        title: '用途不能为空!',
        icon:"none",
        duration: 1500
      })

      setTimeout(
        () => { wx.hideToast() }, 
        2000
      )

    } else {

      let apInfo = this.data.cardView;
      let execDate = new Date(apInfo.execDate);
      console.log(execDate);
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
      
      console.log(res.data);
      if (res.data.code != 200) {

        await wx.showToast({
          title: '提交失败！',
          icon: 'loading',
          duration: 1500,
        })

      } else {
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
          title: '提交成功！',//这里打印出登录成功
          icon: 'success',
          duration: 1000,
        })
        //不跳转到预约进度页面，多次预约
        // await wx.navigateTo({ 
        //   url: '../../my/process/process',
        // })
        //播放动画，关闭
        this.hideModal();
      }
    }
  },
  //初始化页面标题
  //初始化预约时间列表
  onLoad: async function (options) {
    await app.globalData.userInfoP;
    this.data.roomId = Number(options.roomId);
    let roomRes = await request({
      url: app.globalData.server + '/room/'+options.roomId,
      header: app.globalData.APIHeader,
      method:"GET",
    })
    let room = roomRes.data.data.roomInfo;

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
    this.setData({
      windowHeight: app.systemInfo.windowHeight,
      roomName: room.name,
      schedule :scheduleRes.data.data.timeList,
      week : weekNow,
    })
    await this.refreshTable(new Date());
  },

  onShow:async function(){
    await this.refreshTable(new Date());
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
      console.log(newDate);
      operations.push(this.fetchColumn(newDate))
    }
    let results = await Promise.all(operations);
    console.log(results);
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
    console.log(listRes.data.data.freeTime)

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
      listRes.data.data.freeTime,
      profile.statusMap.avaliable
    );
    marker(schedule ,
      listRes.data.data.passTime,
      profile.statusMap.past
    );
    marker(schedule ,
      listRes.data.data.myTime,
      profile.statusMap.mine
    );
    marker(schedule ,
      listRes.data.data.busyTime,
      profile.statusMap.occupied
    );
    console.log(schedule);

    let weekNow =  Math.floor(
      (date.getTime() - profile.weekbegin) / 
      (7  * 24 * 60 * 60 * 1000 ) 
    ) 
    let dayNow = (date.getDay()+6)%7 +1;
    let resWlist  = [];
    for(let item of schedule){
      let res= {
        "djz": weekNow , 
        "xqj": dayNow , 
        "yysd": item.id , 
        "yycd": 1 ,
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
    console.log(dateNow);
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
    console.log(e)
    let cardView = { ...e.currentTarget.dataset.wlist }
    if(e.currentTarget.dataset.wlist.color === 1){
      if(app.globalData.userInfoComplete){
        this.setData({
          cardView: cardView,
          //展示对话框
          showModalStatus: true,
        });
      }else{
        wx.showToast({
          title: '用户信息尚不完善，无法预约！',
        })
      }
    }
  },

  hideModal() { //点击弹框外空白处收起弹框(取消按钮相同)
    setTimeout(function () {
      this.setData({
        showModalStatus: false
      });
    }.bind(this), 200)
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