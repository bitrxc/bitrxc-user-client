// components/notice/notice.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 在ServerStatus.json文件中的消息定义 */
    "infoName":String,
    /** 占位符文本 */
    "placeholder":String,
    /** 类型 */
    "type":String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    text:"",
    background:"info",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh:function () {
      let info = app.globalData.serverStatus[this.data.infoName];
      console.log(info)
      if(info){
        this.setData({
          background:this.data.type || 'info',
          text:info
        })
      }else if(this.data.placeholder){
        this.setData({
          background:this.data.type || 'info',
          text:this.data.placeholder
        })
      }else{
        this.setData({
          background:'none',
          text:' '
        })
      }
    }
  },
  lifetimes:{
    attached:function () {
      this.refresh();
    }
  }
})
