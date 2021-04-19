import {EnhancedDate} from '../EnhancedDate'
export function test(){
  EnhancedDate.weekBegin = Date.parse("2021-02-28");
  for(let i = 1;i<21;i++){
    for(let j = 1;j<8;j++){
      let enhanced = new EnhancedDate({week:i,weekDay:j})
      console.log(enhanced.toISODateString(),enhanced.week,enhanced.weekDay)
    }
  }
}