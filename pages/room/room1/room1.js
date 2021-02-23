// js
Page({
  data: {
    roomName: "党建活动室",
    show: false,
    weekList: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    day: ['一','二','三','四','五','六','日'],
    wlist: [
      { "xqj": 4, "yysd": 2, "yycd": 1, "zt": "已预约",  "color": 1 }, //用户已预约时段用1表示
      { "xqj": 1, "yysd": 2, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      { "xqj": 2, "yysd": 1, "yycd": 1, "zt": "可预约",  "color": 0 },    //用户可预约时段用0表示
      { "xqj": 1, "yysd": 1, "yycd": 1, "zt": "来晚了",  "color": -1 },//不可预约时段用-1表示
    ],
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
        })
      },
    })
  },

  clickShow: function (e) { //显示周下拉菜单
    var that = this;
    that.setData({
      show: !that.data.show,
    })
  },

  clickHide: function (e) { //隐藏周下拉菜单
    var that = this
    that.setData({
      show: false
    })
  },

  stopTouchMove: function () {
    return false;
  },

  showCardView: function (e) { //点击可预约区域，弹框显示预约信息
    console.log(e)
    let cardView = {
      zt: e.currentTarget.dataset.wlist.zt,
      color: e.currentTarget.dataset.wlist.color,
      yysd: e.currentTarget.dataset.wlist.yysd,
      xqj: e.currentTarget.dataset.wlist.xqj,
    }
    if(e.currentTarget.dataset.wlist.color === 0){
      this.setData({
        cardView: cardView
      })
      this.util("open");
    }
  },

  hideModal() { //点击弹框外空白处收起弹框(取消按钮相同)
    this.util("close");
  },

  onOK: function () {  //确定按钮

  },

  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 100, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation
      })

      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
    }
  },
})
