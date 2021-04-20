// @ts-check
/** 
 * 用promise封装微信的request函数
 * @template payload 请求的负载，可以为任何JSON兼容的类型，包括数组
 * @param {Omit<WechatMiniprogram.RequestOption,"success" | "fail" | "finish">} params
 * @return {Promise<WechatMiniprogram.RequestSuccessCallbackResult<payload>>} 
 */ 
export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success: (result) => {
        //@ts-ignore 因为微信的接口定义不完整，实际返回值是任何兼容JSON的类型，包括数组
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 用promise封装的延时函数
 * @param {number} delay 以毫秒计的延时
 * @returns {Promise<void>}
 */
export const delay = (delay) =>{
  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, delay)
  );
}