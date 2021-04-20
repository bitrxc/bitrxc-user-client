// @ts-check
/**
 * @module
 */
/** 
 * 由后端接口返回的错误
 * @typedef
 * @property {number} code
 * @property {string} message
 * @property {string} errMsg
 * @property {string} name
 */
export const APIError = class extends Error {
  /**
   * 构造函数
   * @param {number} code 
   * @param {string} message 
   */
  constructor(code,message){
    super(message);
    this.code = code;
    this.errMsg = message
    this.name = "APIError";
  }
};