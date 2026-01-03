# Viber Coding - 智能编程助手

一款基于Electron和DeepSeek AI的Windows桌面智能编程助手应用，专为Java和Vue开发者打造。

## 功能特性

### 🚀 代码生成
- 支持Java和Vue代码自动生成
- 智能理解需求描述，生成高质量代码
- 支持上下文代码参考，提高生成准确性

### 💡 智能补全
- 基于AI的代码智能补全
- 支持Java和Vue语法
- 实时代码建议

### 🔍 代码分析
- 深度代码质量分析
- 提供优化建议
- 最佳实践指导

## 技术栈

- **前端框架**: Electron
- **UI设计**: 原生HTML/CSS/JavaScript
- **AI模型**: DeepSeek
- **状态管理**: electron-store

## 安装步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置API Key
在应用首次启动时，DeepSeek API Key会自动设置为：
```

```

您也可以在"设置"页面中修改API Key。

### 3. 启动应用
```bash
npm start
```

开发模式启动：
```bash
npm run dev
```

## 使用说明

### 代码生成
1. 选择编程语言（Java或Vue）
2. 输入您的需求描述
3. （可选）提供上下文代码
4. 点击"生成代码"按钮
5. 复制生成的代码

### 智能补全
1. 选择编程语言
2. 输入部分代码片段
3. 点击"智能补全"按钮
4. 复制补全的代码

### 代码分析
1. 选择编程语言
2. 粘贴要分析的代码
3. 点击"分析代码"按钮
4. 查看分析报告

## 项目结构

```
viber-coding/
├── main.js              # Electron主进程
├── preload.js           # 预加载脚本
├── index.html           # 主界面HTML
├── styles.css           # 样式文件
├── renderer.js          # 渲染进程逻辑
├── package.json         # 项目配置
├── README.md           # 项目说明
└── assets/             # 资源文件
    └── icon.png        # 应用图标
```

## 打包发布

### Windows打包
```bash
npm run build
```

打包后的安装包将输出到`dist/`目录。

## API配置

DeepSeek API endpoint: `https://api.deepseek.com/v1/chat/completions`

默认模型: `deepseek-chat`

## 系统要求

- Windows 10/11
- Node.js 16+
- 网络连接（调用DeepSeek API）

## 注意事项

1. 确保网络连接正常，API调用需要联网
2. API Key请妥善保管，不要泄露
3. 每次API调用都会消耗DeepSeek的配额
4. 生成代码后请进行测试和验证

## 开发者信息

- **项目名称**: Viber Coding
- **版本**: 1.0.0
- **开发语言**: JavaScript
- **框架**: Electron

## 许可证

MIT License

---

**Viber Coding** - 让编程更智能！
