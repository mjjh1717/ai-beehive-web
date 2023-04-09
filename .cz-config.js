/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 15:18:41
 * @FilePath: \chagpt-shuowen\.cz-config.js
 * @Description: commit
 */
module.exports = {
  types: [
    { value: 'feat',      name:'✨ feat:      新功能' },
    { value: 'fix',       name:'🐛 fix:       修复bug' },
    { value: 'docs',      name:'✏️ docs:      文档变更' },
    { value: 'style',     name:'💄 style:     代码格式（不影响功能，例如空格、分号等格式修正）' },
    { value: 'refactor',  name:'🔨 refactor:  代码重构（不包括 bug 修复、功能新增）' },
    { value: 'perf',      name:'⚡️ perf:      性能优化' },
    { value: 'test',      name:'✅ test:      添加、修改测试用例' },
    { value: 'build',     name:'📦️ build:     构建流程、外部依赖变更（如升级 npm 包、修改 脚手架 配置等）' },
    { value: 'ci',        name:'👷 ci:        修改 CI 配置、脚本' },
    { value: 'chore',     name:'🚀 chore:     对构建过程或辅助工具和库的更改（不影响源文件、测试用例）' },
    { value: 'revert',    name:'⏪️ revert:    回滚 commit' },
    { value: 'wip',       name:'🔧 wip:       开发中' },
    { value: 'mod',       name:'🚽 mod:       不确定分类的修改' },
  ],
  scopes: [
    ['custom', '自定义'],
		['projects', '项目搭建'],
    ['components', '组件相关'],
    ['utils', 'utils 相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['other', '其他修改'],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  messages: {
    type: '确保本次提交遵循 Angular 规范！选择你要提交的类型：\n',
    scope: '选择一个 scope（可选）：',
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：',
    breaking: '列举非兼容性重大的变更（可选）：',
    footer: '列举出所有变更的 Issues Closed（可选）。 例如: #31, #34：',
    confirmCommit: '确认提交？'
  },
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  breaklineChar: '|'
}
