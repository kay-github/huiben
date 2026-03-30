# 回本计算器项目文档索引

- Project: 回本计算器
- Purpose: 为后来者提供一份快速定位关键文档的入口
- Last Updated: 2026-03-29

## 1. 怎么使用这份索引

如果你是第一次接手这个项目，建议按下面顺序阅读：

1. `PROJECT_METHOD_SUMMARY.md`
2. `PROJECT_WORKFLOW.md`
3. `PROJECT_PLAYBOOK.md`
4. `product-design/01-prd.md`
5. `product-design/02-test-cases.md`
6. `product-design/03-development-rules.md`
7. 再根据你的角色继续看对应文档

## 2. 根目录文档

### `PROJECT_METHOD_SUMMARY.md`

作用：

1. 用最短路径理解这个项目沉淀出的核心方法论
2. 适合管理者、后来者、复盘人员快速阅读

### `PROJECT_WORKFLOW.md`

作用：

1. 解释本项目的整体工作流
2. 说明为什么这个项目的关键在流程控制，而不是技术实现复杂度

### `PROJECT_PLAYBOOK.md`

作用：

1. 提供可执行 SOP
2. 说明每个阶段该怎么做、做完什么算通过

### `PROJECT_INDEX.md`

作用：

1. 作为所有关键文档的入口

## 3. 产品定义文档

目录：`product-design/`

### `product-design/01-prd.md`

作用：

1. 定义产品边界
2. 定义功能、交互、视觉和验收要求

### `product-design/02-test-cases.md`

作用：

1. 定义测试标准
2. 约束公式、输入规则、交互和视觉验收点

### `product-design/03-development-rules.md`

作用：

1. 约束开发 AI 的行为
2. 防止擅自扩展功能或偏离产品定位

## 4. UI 设计提示词与设计资料

目录：`product-design/ui-design-prompt/`

### `04-ui-design-prompt.md`

第一版 UI 设计提示词。

### `05-ui-design-prompt-v2.md`

第二版 UI 返工提示词，用于修正初稿偏差。

### `06-ui-design-prompt-v3.md`

第三版 UI 收敛提示词，用于逼近可开发定稿。

目录：`product-design/stitch/`

### `screen.png`

最终可开发方向的视觉参考图。

### `code.html`

设计导出的网页结构参考，用于辅助开发还原。

### `DESIGN.md`

设计过程资料，仅作背景参考，优先级低于 PRD 和最终定稿方向。

## 5. 开发与修正提示词

目录：`product-design/`

### `07-development-ai-prompt.md`

小程序主实现提示词。

### `08-development-ai-followup-prompt.md`

小程序修正提示词，用于处理首轮验收后发现的问题。

### `09-web-development-ai-prompt.md`

网页版展示版开发提示词，用于将已验收小程序受控转换为网页版本。

## 6. 测试提示词

目录：`product-design/`

### `10-web-test-ai-prompt.md`

网页版测试 AI 提示词，用于形成最终测试放行闸门。

## 7. 实现目录

### `huiben-calculator/`

原生微信小程序实现目录。

适合：

1. 后续继续推进小程序上线
2. 作为产品正式实现基线

### `huiben-calculator-web/`

网页版展示版实现目录。

适合：

1. 浏览器快速展示
2. 向领导或外部快速演示成果

## 8. 不同角色该先看什么

### 如果你是产品经理

建议阅读：

1. `PROJECT_WORKFLOW.md`
2. `PROJECT_PLAYBOOK.md`
3. `product-design/01-prd.md`
4. `product-design/02-test-cases.md`
5. `product-design/03-development-rules.md`

### 如果你是 UI 设计师或 UI 设计 AI

建议阅读：

1. `product-design/01-prd.md`
2. `product-design/ui-design-prompt/04-ui-design-prompt.md`
3. `product-design/ui-design-prompt/05-ui-design-prompt-v2.md`
4. `product-design/ui-design-prompt/06-ui-design-prompt-v3.md`
5. `product-design/stitch/screen.png`

### 如果你是开发者或开发 AI

建议阅读：

1. `product-design/01-prd.md`
2. `product-design/02-test-cases.md`
3. `product-design/03-development-rules.md`
4. `product-design/07-development-ai-prompt.md`
5. `product-design/08-development-ai-followup-prompt.md`
6. `product-design/09-web-development-ai-prompt.md`

### 如果你是测试或测试 AI

建议阅读：

1. `product-design/01-prd.md`
2. `product-design/02-test-cases.md`
3. `product-design/03-development-rules.md`
4. `product-design/10-web-test-ai-prompt.md`

## 9. 当前项目结论

当前项目已形成完整闭环：

1. 产品定义完成
2. 设计收敛完成
3. 小程序实现完成并验收
4. 网页展示版实现完成并验收
5. 测试 AI 已明确给出通过结论

因此，现阶段最重要的不是继续发散，而是：

1. 复用这套流程
2. 保持文档可追溯
3. 在后续迭代中继续遵守相同约束机制
