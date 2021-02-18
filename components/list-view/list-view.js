// components/list-view/list-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "list":Array,
    "targetPage":String,
    "targetID":String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  
  /**
   * 组件的方法列表
   */
  methods: {

  },
  observers:{
    'list':function (newprop) {
      let res=[];
      if(newprop&&newprop[Symbol.iterator]&&newprop.length){
        res = Array.from(newprop);
        this.setData({
          isEmpty:false,
        })
      }else{
        this.setData({
          isEmpty:true,
        }) 
      }
      return res;
    }
  },
 

})
