# 快速开始指南

## 🚀 5分钟上手

### 第一步：安装环境

#### Windows 用户
1. 安装 [Node.js](https://nodejs.org/) (选择 LTS 版本)
2. 安装 [Rust](https://www.rust-lang.org/tools/install)
3. 安装 [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/zh-hans/downloads/)

#### macOS 用户
```bash
# 安装 Xcode 命令行工具
xcode-select --install

# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Node.js（推荐使用 Homebrew）
brew install node
```

#### Linux 用户（Ubuntu/Debian）
```bash
# 安装系统依赖
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 第二步：安装项目依赖

```bash
# 进入项目目录
cd baby-growth-tracker

# 安装 Node.js 依赖
npm install
```

### 第三步：运行应用

```bash
# 开发模式（首次运行需要 5-10 分钟编译 Rust）
npm run tauri:dev
```

### 第四步：构建可执行文件（可选）

```bash
# 构建生产版本
npm run tauri:build
```

构建完成后，在以下目录找到安装包：
- Windows: `src-tauri/target/release/bundle/msi/`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/`

## 💡 使用技巧

### 初次配置
1. 启动应用后，设置宝宝出生日期
2. 选择存放照片/视频的文件夹
3. 点击"选择文件夹"开始扫描

### 快捷操作
- **查看特定月龄**：点击左侧边栏的月龄标签
- **查看大图**：点击照片卡片进入预览模式
- **添加笔记**：在预览模式下点击"编辑"按钮
- **修改设置**：点击右上角"设置"按钮

### 性能优化建议
- ✅ 首次扫描后，缩略图会自动缓存
- ✅ 后续打开应用速度极快
- ✅ 建议照片数量：10000+ 张依然流畅
- ✅ 定期备份数据库文件

## ❓ 遇到问题？

### 编译失败
- 确保 Rust 和 Node.js 版本正确
- Windows 用户确认已安装 Visual Studio C++ Build Tools
- 尝试删除 `node_modules` 和 `src-tauri/target`，重新安装

### 应用打不开
- 检查系统是否支持 WebView2 (Windows 10/11)
- macOS 需要 10.15+ 版本
- Linux 需要安装 webkit2gtk

### 文件扫描慢
- 首次扫描需要时间，会生成缩略图
- 后续打开速度会大幅提升
- 建议照片文件夹不要跨多个磁盘

## 📞 获取帮助

查看完整文档：[README.md](README.md)

---

**祝您使用愉快！** 🎉
