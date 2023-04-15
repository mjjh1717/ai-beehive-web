/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 14:06:24
 * @FilePath: \chatgpt-shuowen\src\api\register.ts
 * @Description: 注册 相关接口
 */
import { get, post } from '@/utils/request'

/**
 * @description: 获取图片验证码
 * @return {*}
 */
export function getPicCode<T>() {
  return get<T>({
    url: '/user/get_pic_code',
  })
}
// returnType

export interface getPicCodeType {
  // 图形验证码Base64
  picCodeBase64: string
  // 图形验证码会话ID，注册时需要传过来
  picCodeSessionId: string
}

/**
 * @description: 邮件验证回调验证码
 * @param {string} code
 * @return {*}
 */
export function verifyEmailCode<T>(code: string) {
  return get<T>({
    url: '/user/verify_email_code',
    data: { code },
  })
}

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

export enum RegisterType {
  Email = 'email',
  Phone = 'phone',
}
/**
 * @description: 注册
 * @param {ApifoxModel} data
 * @return {*}
 */
export function registerEmail<T>(data: registerModel) {
  return post<T>({
    url: '/user/register/email',
    data,
  })
}
