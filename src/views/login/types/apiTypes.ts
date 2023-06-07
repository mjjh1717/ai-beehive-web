/*
 * @Author: mjjh
 * @LastEditTime: 2023-05-28 22:23:48
 * @FilePath: \ai-beehive-web\src\views\login\types\apiTypes.ts
 * @Description:
 */
// 前端用户登录类型
export interface loginModel {
  // 密码
  password: string
  // 邮箱地址
  username: string
}

// 验证码类型
export interface getPicCodeType {
  // 图形验证码Base64
  picCodeBase64: string
  // 图形验证码会话ID，注册时需要传过来
  picCodeSessionId: string
}

// 注册类型1
export interface registerModel {
  // 用户ID，可以为邮箱，可以为手机号
  identity: string
  // 密码信息，邮箱注册时需传入，手机注册时不用传入
  password: string
  //  图形验证码会话ID，必传
  picCodeSessionId: string
  // 图片验证码，必传
  picVerificationCode: string
  registerType: RegisterType
}
// 注册类型2
export enum RegisterType {
  Email = 'email',
  Phone = 'phone',
}

