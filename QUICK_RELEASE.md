# 🚀 快速发布指南

这是一个超级简化的发布流程，让您在 **5 分钟内** 获得可安装的应用程序！

## 前提条件

- ✅ 拥有 GitHub 账号（免费账号即可）
- ✅ 本地已安装 Git

## 📋 发布步骤

### 第 1 步：创建 GitHub 仓库（2 分钟）

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **仓库名称**：`baby-growth-tracker`（或其他名称）
   - **可见性**：Public 或 Private（都支持 Actions）
   - **不要**勾选 "Add a README file"
3. 点击 **Create repository**
4. **复制仓库地址**（页面上会显示，类似 `https://github.com/你的用户名/baby-growth-tracker.git`）

### 第 2 步：上传代码（1 分钟）

#### Windows 用户

1. 双击运行项目根目录下的 `upload-to-github.bat`
2. 粘贴刚才复制的仓库地址
3. 按回车，等待上传完成

#### macOS/Linux 用户

1. 打开终端，进入项目目录
2. 运行：
   ```bash
   chmod +x upload-to-github.sh
   ./upload-to-github.sh
   ```
3. 粘贴刚才复制的仓库地址
4. 按回车，等待上传完成

### 第 3 步：触发构建（30 秒）

上传完成后，在项目目录运行：

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 第 4 步：下载安装包（10-20 分钟后）

1. 打开您的 GitHub 仓库页面
2. 点击顶部的 **Actions** 标签
3. 查看构建进度（绿色 ✅ 表示完成）
4. 构建完成后，点击顶部的 **Releases** 或仓库首页右侧的 **Releases**
5. 下载对应平台的安装包：
   - **Windows**：`.msi` 文件
   - **macOS**：`.dmg` 文件
   - **Linux**：`.AppImage` 文件

## 🎉 完成！

双击下载的安装包，即可安装使用！

---

## ⚡ 更简单的方法（手动触发）

如果不想创建标签，也可以手动触发构建：

1. 完成上传代码后
2. 打开 GitHub 仓库页面
3. 点击 **Actions** 标签
4. 左侧选择 **构建发布版本**
5. 点击右侧 **Run workflow** 按钮
6. 选择 `main` 分支
7. 点击 **Run workflow**

---

## 🆘 遇到问题？

### Git 命令失败

**原因**：可能没有安装 Git  
**解决**：访问 https://git-scm.com/downloads 下载安装

### 推送时要求输入用户名密码

**原因**：GitHub 需要身份验证  
**解决**：使用个人访问令牌（Personal Access Token）：
1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成并复制令牌
5. 在推送时，用户名输入 GitHub 用户名，密码输入令牌

### Actions 构建失败

**原因**：可能是代码问题或 Actions 配置问题  
**解决**：
1. 点击失败的构建任务
2. 查看详细日志
3. 根据错误信息修复

---

## 📚 想了解更多？

查看完整教程：[GitHub Actions 自动构建指南](GITHUB_ACTIONS_GUIDE.md)
