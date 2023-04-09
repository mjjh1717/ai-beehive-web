/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:28:37
 * @FilePath: \chagpt-shuowen\src\plugins\scrollbarStyle.ts
 * @Description: 滚动条
 */
import { darkTheme, lightTheme } from 'naive-ui'

const setupScrollbarStyle = () => {
  const style = document.createElement('style')
  const styleContent = `
    ::-webkit-scrollbar {
      background-color: transparent;
      width: ${lightTheme.Scrollbar.common?.scrollbarWidth};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${lightTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${lightTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
    html.dark ::-webkit-scrollbar {
      background-color: transparent;
      width: ${darkTheme.Scrollbar.common?.scrollbarWidth};
    }
    html.dark ::-webkit-scrollbar-thumb {
      background-color: ${darkTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${darkTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
  `

  style.innerHTML = styleContent
  document.head.appendChild(style)
}

export default setupScrollbarStyle
