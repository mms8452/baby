# 部署指南

## 📦 构建可执行文件

### 准备工作

1. **确保所有依赖已安装**
   ```bash
   npm install
   ```

2. **准备应用图标**
   - 将图标文件放入 `src-tauri/icons/` 目录
   - 参考 `src-tauri/icons/README.md` 了解图标要求

### 构建命令

```bash
# 构建生产版本
npm run tauri:build
```

构建过程：
1. 编译 React 前端（Vite）
2. 编译 Rust 后端（Release 模式）
3. 打包应用和资源
4. 生成安装包

构建时间：
- 首次构建：10-20 分钟
- 后续构建：2-5 分钟

## 📂 构建产物位置

### Windows
- **MSI 安装包**: `src-tauri/target/release/bundle/msi/baby-growth-tracker_1.0.0_x64_zh-CN.msi`
- **NSIS 安装包**: `src-tauri/target/release/bundle/nsis/baby-growth-tracker_1.0.0_x64-setup.exe`
- **便携版**: `src-tauri/target/release/baby-growth-tracker.exe`

### macOS
- **DMG 镜像**: `src-tauri/target/release/bundle/dmg/baby-growth-tracker_1.0.0_x64.dmg`
- **App 包**: `src-tauri/target/release/bundle/macos/baby-growth-tracker.app`

### Linux
- **DEB 包**: `src-tauri/target/release/bundle/deb/baby-growth-tracker_1.0.0_amd64.deb`
- **AppImage**: `src-tauri/target/release/bundle/appimage/baby-growth-tracker_1.0.0_amd64.AppImage`
- **可执行文件**: `src-tauri/target/release/baby-growth-tracker`

## 🚀 分发方式

### 方式一：直接分发安装包

**Windows:**
```bash
# 用户只需双击 .msi 或 .exe 文件安装
baby-growth-tracker_1.0.0_x64_zh-CN.msi
```

**macOS:**
```bash
# 用户打开 .dmg，拖动到应用程序文件夹
baby-growth-tracker_1.0.0_x64.dmg
```

**Linux:**
```bash
# DEB 包安装
sudo dpkg -i baby-growth-tracker_1.0.0_amd64.deb

# AppImage 直接运行
chmod +x baby-growth-tracker_1.0.0_amd64.AppImage
./baby-growth-tracker_1.0.0_amd64.AppImage
```

### 方式二：上传到云盘

推荐云盘：
- 百度网盘
- 阿里云盘
- OneDrive
- Google Drive

### 方式三：GitHub Release

1. 创建 GitHub 仓库
2. 推送代码
3. 创建 Release
4. 上传构建产物

```bash
# 示例
git tag v1.0.0
git push origin v1.0.0
# 在 GitHub 创建 Release，上传安装包
```

## 🔒 代码签名（可选）

### Windows
需要购买代码签名证书：
- DigiCert
- Sectigo
- GlobalSign

签名命令：
```bash
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com baby-growth-tracker.exe
```

### macOS
需要 Apple Developer 账号（$99/年）：
```bash
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" baby-growth-tracker.app
```

### 为什么需要签名？
- ✅ 用户信任度更高
- ✅ 避免 Windows SmartScreen 警告
- ✅ macOS Gatekeeper 允许运行
- ❌ 但需要付费，个人项目可选

## 📊 应用体积优化

### 当前体积
- Windows: ~8-15 MB
- macOS: ~10-18 MB
- Linux: ~12-20 MB

### 优化建议

1. **启用 UPX 压缩** (可选)
   ```toml
   # 在 Cargo.toml 中添加
   [profile.release]
   opt-level = "z"
   lto = true
   codegen-units = 1
   strip = true
   ```

2. **移除未使用的依赖**
   ```bash
   cargo tree # 查看依赖树
   # 删除不必要的依赖
   ```

3. **优化图片资源**
   - 使用 WebP 格式
   - 压缩 PNG 图片

## 🧪 测试清单

构建完成后，测试以下功能：

- [ ] 应用能正常启动
- [ ] 首次启动显示设置对话框
- [ ] 可以选择文件夹
- [ ] 文件扫描正常
- [ ] 缩略图生成正常
- [ ] 月龄分类正确
- [ ] 图片预览正常
- [ ] 视频播放正常
- [ ] 便利贴保存成功
- [ ] 设置可以修改和保存
- [ ] 应用重启后数据保留

## 📝 发布说明模板

```markdown
# 宝宝成长记录工具 v1.0.0

## 新功能
- ✨ 智能月龄分类
- ✨ 高性能缩略图生成
- ✨ 便利贴功能
- ✨ 图片/视频预览

## 下载
- Windows: [baby-growth-tracker-1.0.0-setup.exe](链接)
- macOS: [baby-growth-tracker-1.0.0.dmg](链接)
- Linux: [baby-growth-tracker-1.0.0.AppImage](链接)

## 系统要求
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+)

## 使用说明
请查看 [README.md](README.md)
```

## 🔄 自动化构建（高级）

### GitHub Actions

创建 `.github/workflows/build.yml`：
```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: dtolnay/rust-toolchain@stable
      
      - run: npm install
      - run: npm run tauri:build
      
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: src-tauri/target/release/bundle/
```

## 📞 问题排查

### 构建失败
- 检查 Rust 版本：`rustc --version`
- 检查 Node 版本：`node --version`
- 清理缓存：`rm -rf target node_modules && npm install`

### 应用闪退
- 查看日志文件
- 检查依赖库是否完整
- 尝试在终端运行查看错误信息

### 体积过大
- 检查是否包含了调试符号
- 确认使用 Release 模式构建
- 考虑使用 UPX 压缩

---

**祝您构建顺利！** 🎉
