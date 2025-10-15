#!/bin/bash

echo "========================================"
echo "   宝宝成长记录工具 - GitHub 上传助手"
echo "========================================"
echo ""

# 检查是否已经初始化 Git
if [ ! -d ".git" ]; then
    echo "📦 正在初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库初始化完成"
else
    echo "✅ Git 仓库已存在"
fi

echo ""
echo "请输入您的 GitHub 仓库地址（例如：https://github.com/用户名/baby-growth-tracker.git）："
read repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 仓库地址不能为空！"
    exit 1
fi

echo ""
echo "📝 正在添加所有文件..."
git add .

echo "💾 正在提交代码..."
git commit -m "初始化宝宝成长记录应用"

echo "🔗 正在关联远程仓库..."
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

echo "🚀 正在推送代码到 GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "   ✅ 上传成功！"
    echo "========================================"
    echo ""
    echo "下一步：创建版本标签以触发自动构建"
    echo ""
    echo "运行以下命令："
    echo "  git tag v1.0.0"
    echo "  git push origin v1.0.0"
    echo ""
    echo "然后访问您的 GitHub 仓库，在 Actions 页面查看构建进度。"
    echo "构建完成后，到 Releases 页面下载安装包。"
    echo ""
else
    echo ""
    echo "❌ 上传失败！请检查："
    echo "  1. 网络连接是否正常"
    echo "  2. GitHub 仓库地址是否正确"
    echo "  3. 是否有仓库的推送权限"
    echo ""
fi
