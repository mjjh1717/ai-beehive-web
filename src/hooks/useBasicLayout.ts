/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-08 14:17:42
 * @FilePath: \chatgpt-shuowen\src\hooks\useBasicLayout.ts
 * @Description: 基本样式大小为sm
 */
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useBasicLayout() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')

  return { isMobile }
}
