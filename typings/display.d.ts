export type appointmentCard = {
  /** 用户的签到时间 */
  yysj,
  /** 用户发起预约的时间 */
  launchTime,
  /** 房间名字 */
  roomName,
  /** 预约人姓名 */
  userName,
  /** 人数 */
  rs,
  /** 用途说明 */
  ytsm,
  /** 预约状态提示文本 */
  statusText,
  /** 能否取消 */
  cancelable,
  schedule,
  beginTime,
  endTime,
  week,
  weekDay
}