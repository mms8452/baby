# GitHub Actions 自动构建指南

## 📦 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的免费自动化服务，可以在云端自动构建 Windows、macOS 和 Linux 三个平台的安装包，无需本地环境配置。

## 🚀 快速开始

### 步骤 1：将项目上传到 GitHub

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 输入仓库名称（如 `baby-growth-tracker`）
   - 选择 **Public** 或 **Private**（都可以使用 Actions）
   - 点击 **Create repository**

2. **上传代码到 GitHub**
   
   在项目根目录打开命令行：
   
   ```bash
   # 初始化 Git 仓库
   git init
   
   # 添加所有文件
   git add .
   
   # 提交代码
   git commit -m "初始化宝宝成长记录应用"
   
   # 关联远程仓库（替换为你的仓库地址）
   git remote add origin https://github.com/你的用户名/baby-growth-tracker.git
   
   # 推送代码
   git branch -M main
   git push -u origin main
   ```

### 步骤 2：触发自动构建

有两种方式触发构建：

#### 方式一：创建版本标签（推荐）

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签到 GitHub
git push origin v1.0.0
```

#### 方式二：手动触发

1. 打开你的 GitHub 仓库页面
2. 点击顶部的 **Actions** 标签
3. 在左侧选择 **构建发布版本**
4. 点击右侧的 **Run workflow** 按钮
5. 选择分支（通常是 `main`）
6. 点击 **Run workflow**

### 步骤 3：等待构建完成

1. 在 **Actions** 页面，你会看到构建任务正在运行
2. 构建时间约 **10-20 分钟**（三个平台并行构建）
3. 构建完成后，状态会显示为 ✅ 绿色对勾

### 步骤 4：下载安装包

构建完成后：

1. 打开仓库的 **Releases** 页面
2. 找到最新的发布版本（如 `v1.0.0`）
3. 在 **Assets** 部分，你会看到：
   - **Windows**: `baby-growth-tracker_x.x.x_x64_en-US.msi`
   - **macOS**: `baby-growth-tracker_x.x.x_x64.dmg`
   - **Linux**: `baby-growth-tracker_x.x.x_amd64.AppImage`

4. 下载对应平台的安装包
5. 双击安装即可使用！

## 🎯 构建产物说明

### Windows (.msi)
- 双击直接安装
- 会自动添加到开始菜单
- 可以选择安装路径

### macOS (.dmg)
- 双击打开
- 拖动应用图标到 Applications 文件夹
- 首次运行可能需要在"系统偏好设置 > 安全性与隐私"中允许

### Linux (.AppImage)
- 添加执行权限：`chmod +x baby-growth-tracker_*.AppImage`
- 直接运行：`./baby-growth-tracker_*.AppImage`
- 或双击运行（需要文件管理器支持）

## 🔧 常见问题

### Q: 为什么构建失败了？

**可能原因**：
1. 代码中存在语法错误
2. 依赖安装失败
3. GitHub Actions 配额用完（免费账户每月 2000 分钟）

**解决方法**：
1. 查看 Actions 页面的构建日志，找到具体错误信息
2. 修复错误后，重新推送代码或重新触发构建

### Q: 我可以修改应用名称或图标吗？

可以！修改以下文件：

1. **应用名称**：编辑 `src-tauri/tauri.conf.json`
   ```json
   {
     "package": {
       "productName": "你的应用名称"
     }
   }
   ```

2. **应用图标**：
   - 准备一个 1024x1024 的 PNG 图片
   - 替换 `src-tauri/icons/` 目录下的图标文件
   - 或使用在线工具生成：https://tauri.app/zh-cn/v1/guides/features/icons

### Q: 每次都要推送到 GitHub 吗？

是的，GitHub Actions 需要代码在 GitHub 仓库中才能构建。但你只需要推送一次，后续可以通过标签或手动触发来构建。

### Q: 构建的应用会自动更新吗？

当前版本不包含自动更新功能。如果需要，可以：
1. 集成 Tauri 的 Updater 功能
2. 让用户手动下载新版本安装包

### Q: 可以只构建 Windows 版本吗？

可以！编辑 `.github/workflows/build.yml`，修改 `matrix.platform`：

```yaml
matrix:
  platform: [windows-latest]  # 只构建 Windows
```

## 🎓 进阶使用

### 自定义发布说明

编辑 `.github/workflows/build.yml` 中的 `releaseBody` 字段，可以自定义发布说明的内容。

### 添加构建徽章

在 `README.md` 中添加：

```markdown
![Build Status](https://github.com/你的用户名/baby-growth-tracker/workflows/构建发布版本/badge.svg)
```

这样可以在仓库首页显示构建状态。

## 📞 需要帮助？

如果遇到任何问题：
1. 检查 GitHub Actions 的构建日志
2. 参考 Tauri 官方文档：https://tauri.app/zh-cn/
3. 查看 GitHub Actions 文档：https://docs.github.com/actions

---

**提示**：首次使用 GitHub Actions 可能需要在仓库设置中启用 Actions 功能。
