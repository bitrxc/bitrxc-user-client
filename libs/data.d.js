// @ts-check
/**
 * @module
 */
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
* @property {number|Array|null} gallery
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
 * @typedef 
 * @template payload
 * @property {payload} data
 * @property {number} code
 * @property {string} message
 * @property {boolean} success
 */
export const APIResult = class{};