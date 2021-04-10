// @ts-check
/**
 * @module
 */

import { APIError } from "./errors.d";

/** 
 * @typedef
 * @property {number} id 
 * @property {string} begin
 * @property {number} end
 */
export const Schedule = class{};
/** 
* @typedef
* @property {number} id 
* @property {string} image
* @property {any} description
* @property {string} name
*/
export const Room = class{};
/** 
 * @typedef
 * @property {string} name 
 * @property {string} phone
 * @property {string} organization
 * @property {number} id
 */
export const User = class{};
/**
 * @template payload
 * @typedef APIResult
 * @property {payload} data
 * @property {number} code
 * @property {string} message
 * @property {boolean} success
 */
export const APIResult = class{
  /**
  * 检查后端接口的返回值
  * @template payload
  * @param {APIResult<payload>} data 
  * @throws {APIError}
  * @returns {payload}
  */
  static checkAPIResult(data){
    if(data.success){
      return data.data;
    }else{
      if(data.code<200||data.code>300){
        throw new APIError(data.code,data.message);
      }else{
        return data.data;
      }
    }
  }
};