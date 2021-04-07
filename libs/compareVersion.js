/**
 * 比较微信客户端版本号，若v1新于v2则返回1，v1和v2相等返回0，v1旧于v2返回-1
 * 
 * [微信开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
 * @param {string} v1 
 * @param {string} v2 
 * @returns {-1|0|1}
 */
export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
