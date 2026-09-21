# dsh-plugin-trajectory-tracker

DeepSeek Harness (DSH) 实时执行轨迹跟踪与时序分析独立插件。

## 🌟 核心特性

1. **两段式调用细化拆解**：
   - **首包等待（TTFT）**：精准统计从请求发起至首个 Token 块返回的等待与推理就绪耗时；
   - **生成中（Streaming）**：实时追踪思考流推演与正文生成的流式持续时长。
2. **本地工具执行联动**：
   - 自动识别并展示具体执行的工具名称（如 `调用 bash 工具`、`调用 edit 工具`）；
   - 支持同一次模型调用并发派发多个并行工具（Parallel Tools）的场景归组。
3. **毫秒级单步耗时与实时动态递增**：
   - 右侧单步耗时以带小数点的秒数呈现（如 `1.4s`、`0.3s`）；
   - 正在执行的当前步随毫秒时钟实时向上平滑递增，直至该步骤正式闭环。
4. **悬浮式不占空间弹窗（Zero Space Occupation）**：
   - 采用 React Portal（`createPortal`）直接挂载至 `document.body` 顶层；
   - 展开与收起完全脱离聊天消息文档流，**绝不挤压、不推挤上方任何聊天流空间**；
   - 支持按 `Escape` 键或点击外部区域自动收起。
5. **双端无缝联动**：
   - **生成过程中**：点击底部原生的实时状态条即可随时在正上方展开悬浮式执行轨迹面板；
   - **生成完成后**：点击回答卡片右下角的 `用时 X 秒` 统计胶囊，同样展示规范完整的执行轨迹回溯。

## 📦 安装与配置

在 DSH 的 Web Profile（`~/.dsh/profiles/web/package.json`）中声明依赖并注入插件：

```json
{
  "dependencies": {
    "dsh-plugin-trajectory-tracker": "*"
  }
}
```

插件自带 `cordis.patch.yml` 双面补丁配置，DSH 启动时会自动挂载。

## 📄 开源许可

MIT License
