# 说文 [chatgpt-shuowen](https://github.com/mjjh1717/chatgpt-shuowen)
# 介绍

基于的 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) 版本，适配[后台 chatgpt-web-java](https://github.com/hncboy/chatgpt-web-java)，后续版本开发会在此项目上更新上线功能

- 前端开发[@mjjh](https://github.com/mjjh1717)
- 后端开发[@hncboy](https://github.com/hncboy)
- [客户端 chatgpt-shuowen](https://github.com/mjjh1717/chatgpt-shuowen)
- [管理端 chatgpt-jiezi](https://github.com/hncboy/chatgpt-jiezi)
- [后台 chatgpt-web-java](https://github.com/hncboy/chatgpt-web-java)

## 预览地址

- 客户端：
  - https://front.stargpt.top/ (失效)
  - https://front1.stargpt.top/
  - https://front2.stargpt.top/
  - https://front3.stargpt.top/

## 已实现功能

[✓] 适配java后端

[✓] 多会话储存和上下文逻辑

[✓] 对代码等消息类型的格式化美化处理

[✓] 数据导入、导出

[✓] 保存消息到本地图片

[✓] 界面多语言

[✓] 界面主题

[✗] 登录注册...

# 构建运行

### Getting Started

```shell
# Clone Project
git clone https://github.com/mjjh1717/chatgpt-shuowen

cd chatgpt-shuowen

# Install dependencies(Recommended use pnpm: https://pnpm.io/zh/installation)
npm i -g pnpm # Installed and can be ignored

# !!!重要 需要初始化husky
pnpm bootstrap # or npm bootstrap

# Start
pnpm dev
```

### Build and Release

```shell
# Prod Environment
pnpm build
```

### Other

```shell
# eslint check
pnpm lint

# eslint check and fix
pnpm lint:fix

# Preview（Need to build first）
pnpm preview

# Commit（add+husky+commitlint）
pnpm commit
```

# 修改配置❗❗❗❗
## 参考环境
npm 8.11.0
pnpm 7.5.0
node v16.15.1

[相关问题](https://github.com/mjjh1717/chatgpt-shuowen/issues/2)

## 请求地址

从根目录 .env 文件中的 VITE_APP_API_BASE_URL 修改不同环境中的请求路径

# 联系

<div style="display: flex; align-items: center; gap: 20px;">
  <div style="text-align: center">
    <img style="max-width: 100%" src="pics/wechat_group.png" alt="wechat" />
    <p>微信群</p>
  </div>
</div>
<div style="display: flex; align-items: center; gap: 20px;">
  <div style="text-align: center">
    <img style="max-width: 100%" src="pics/qq_group.png" alt="QQ" />
    <p>631171246</p>
  </div>
</div>

# 赞助

如果觉得项目对你有帮助的，条件允许的话可以点个 Star 或者在赞助一小点。感谢支持~

<div style="display: flex; align-items: center; gap: 20px;">
  <div style="text-align: center">
    <img style="max-width: 100%" src="pics/wechat_pay.png" alt="微信" />
    <p>微信支付</p>
  </div>
  <div style="text-align: center">
    <img style="max-width: 100%" src="pics/zhifubao_pay.png" alt="支付宝" />
    <p>支付宝</p>
  </div>
</div>

# 风险声明

本项目仅供学习和研究使用，不鼓励用于商业用途。我们不对任何因使用本项目而导致的任何损失负责。

# 感谢&赞助

- 非常感谢大家对我们项目和开发工作的支持和认可。我们深知在开源软件开发过程中，用户和社区的反馈和支持是至关重要的。我们的项目代码已经提供了 README 和 issue，方便用户进行部署和解决问题，同时也可以促进我们项目的活跃度，会优先关注 issue 的问题。
- 然而，对于一些用户可能存在需要二次开发或部署方面的困难，我们在开发任务繁忙的情况下，难以抽出时间回答所有用户的问题，但我们会尽最大努力去回答用户的问题。同时，我们也可以提供付费的解答服务，为用户提供更多的支持。
- 我们的开发工作也在持续进行中，我们会不断迭代优化我们的技术设计方案和业务功能，项目不仅仅会提供所需的业务功能，也可以通过项目来学习一些技术的使用。如果您认为我们的开源项目有价值能帮助到您，并愿意支持我们的开发工作，可以为项目点个小星星或者请作者[喝一杯可乐发电](https://afdian.net/a/stargpt) 。我们将非常感谢。

## License

MIT © [mjjh](LICENSE)
