<script setup lang="ts">
import type { MenuInst, MenuOption } from 'naive-ui'
import type { Meta, RouteType } from '~/types/router'
import { useAppStore, usePermissionStore, useThemeStore } from '@/store'
import { isUrl, renderCustomIcon, renderIcon } from '@/utils'

const router = useRouter()
const currentRoute = useRoute()
const permissionStore = usePermissionStore()
const themeStore = useThemeStore()
const appStore = useAppStore()

const menu = ref<MenuInst>()
watch(currentRoute, async () => {
  await nextTick()
  menu.value?.showOption()
})

const menuOptions = computed(() => {
  return permissionStore.menus.map(item => getMenuItem(item)).sort((a, b) => a.order - b.order)
})

function resolvePath(basePath: string, path: string) {
  if (isUrl(path))
    return path
  return (
    `/${
    [basePath, path]
      .filter(path => !!path && path !== '/')
      .map(path => path.replace(/(^\/)|(\/$)/g, ''))
      .join('/')}`
  )
}

interface MennuItem {
  label: string
  key: string
  path: string
  icon: (() => import('vue').VNodeChild) | null
  order: number
  children?: Array<MennuItem>
}

function getMenuItem(route: RouteType, basePath = ''): MennuItem {
  let menuItem: MennuItem = {
    label: (route.meta && route.meta.title) || route.name,
    key: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(route.meta),
    order: route.meta?.order || 0,
  }

  const visibleChildren = route.children ? route.children.filter((item: RouteType) => item.name && !item.isHidden) : []

  if (!visibleChildren.length)
    return menuItem

  if (visibleChildren.length === 1) {
    // 单个子路由处理
    const singleRoute = visibleChildren[0]
    menuItem = {
      label: singleRoute.meta?.title || singleRoute.name,
      key: singleRoute.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute.meta),
      order: menuItem.order,
    }
    const visibleItems = singleRoute.children ? singleRoute.children.filter((item: RouteType) => item.name && !item.isHidden) : []

    if (visibleItems.length === 1)
      menuItem = getMenuItem(visibleItems[0], menuItem.path)
    else if (visibleItems.length > 1)
      menuItem.children = visibleItems.map(item => getMenuItem(item, menuItem.path)).sort((a, b) => a.order - b.order)
  }
  else {
    menuItem.children = visibleChildren
      .map(item => getMenuItem(item, menuItem.path))
      .sort((a, b) => a.order - b.order)
  }

  return menuItem
}

function getIcon(meta?: Meta): (() => import('vue').VNodeChild) | null {
  if (meta?.customIcon)
    return renderCustomIcon(meta.customIcon, { size: 18 })
  if (meta?.icon)
    return renderIcon(meta.icon, { size: 18 })
  return null
}

function handleMenuSelect(key: string, item: MenuOption) {
  const menuItem = item as MennuItem & MenuOption
  if (isUrl(menuItem.path)) {
    window.open(menuItem.path)
    return
  }
  if (menuItem.path === currentRoute.path && !currentRoute.meta?.keepAlive)
    appStore.reloadPage()
  else
    router.push(menuItem.path)

  // 手机端自动收起菜单
  themeStore.isMobile && themeStore.setCollapsed(true)
}
</script>

<template>
  <n-menu
    ref="menu"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :options="menuOptions"
    :value="(currentRoute.meta && currentRoute.meta.activeMenu) || currentRoute.name"
    @update:value="handleMenuSelect"
  />
</template>

<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }
    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}
</style>
