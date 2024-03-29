
 /**
  * 
  */
 export class EnhancedDate extends Date{
  /** 
   * 第一周前的星期日
   * TODO: 从服务段读取此字段
   */
  static weekBegin = Date.parse("2022-02-20");

  /**
   * @param {number} newval
   */
  set week(newval){
    let newDateNum = (new Date(EnhancedDate.weekBegin)).getDate()
      + 7 * newval - 7 + this.weekDay;
    this.setDate(newDateNum);
  }
  /**
   * @returns {number} 
   */
  get week(){
    let weekNow =  Math.floor(
      (this.getTime() - EnhancedDate.weekBegin) / 
      (7  * 24 * 60 * 60 * 1000 ) 
    ) 
    if(this.weekDay == 7){
      weekNow = weekNow -1;
    }
    return weekNow + 1
  }

  /**
   * @param {number} newval
   */
  set weekDay(newval){
    this.setDate(this.getDate() - (this.getDay() + 6)%7 + newval-1 );
  }
  /**
   * @returns {number} 
   */
  get weekDay(){
    return (this.getDay()+6)%7 +1;
  }
  /**
   * 
   * @param {{week:number,weekDay:number}|{time:number}|{date:Date}} options 
   */
  constructor({week:weekParam,weekDay:weekDayParam,time,date}){
    if(weekParam && weekDayParam){
      super(EnhancedDate.weekBegin)
      this.week = weekParam;
      this.weekDay = weekDayParam;
    }else if(time){
      super(time);
    }else if(date && date instanceof Date){
      super(date.getTime());
    }else{
      throw new TypeError('Invalid argument');
    }
  }

  toISODateString () {
    return this.getFullYear() +
      '-' + pad( this.getMonth() + 1 ) +
      '-' + pad( this.getDate() ) ;
  };
}

function pad(number) {
  if ( number < 10 ) {
    return '0' + number;
  }
  return number;
}