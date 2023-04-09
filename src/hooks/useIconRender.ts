/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-08 14:50:17
 * @FilePath: \chatgpt-shuowen\src\hooks\useIconRender.ts
 * @Description: 使用svg图标
 */
import { h } from 'vue'
import { SvgIcon } from '@/components/index'

export const useIconRender = () => {
  interface IconConfig {
    icon?: string
    color?: string
    fontSize?: number
  }

  interface IconStyle {
    color?: string
    fontSize?: string
  }

  const iconRender = (config: IconConfig) => {
    const { color, fontSize, icon } = config

    const style: IconStyle = {}

    if (color)
      style.color = color

    if (fontSize)
      style.fontSize = `${fontSize}px`

    if (!icon)
      window.console.warn('iconRender: icon is required')

    return () => h(SvgIcon, { icon, style })
  }

  return {
    iconRender,
  }
}
