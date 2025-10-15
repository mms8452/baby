# 应用图标说明

## 所需图标文件

为了正确构建 Tauri 应用，你需要准备以下图标文件：

### Windows
- `icon.ico` - Windows 应用图标
  - 推荐尺寸：256x256 像素
  - 格式：.ico

### macOS
- `icon.icns` - macOS 应用图标
  - 包含多个尺寸：16x16, 32x32, 128x128, 256x256, 512x512
  - 格式：.icns

### Linux & 其他
- `32x32.png` - 32x32 像素 PNG
- `128x128.png` - 128x128 像素 PNG
- `128x128@2x.png` - 256x256 像素 PNG (Retina)
- `icon.png` - 512x512 像素 PNG (通用)

## 生成图标

### 方法一：使用在线工具
1. 准备一个 1024x1024 的 PNG 图片
2. 访问 https://www.appicon.co/
3. 上传图片，选择平台，下载图标包

### 方法二：使用 Tauri 图标生成工具
```bash
# 安装 cargo-tauri
cargo install tauri-cli

# 从 PNG 生成所有平台图标
# 准备一个 icon.png (建议 1024x1024)
npm install @tauri-apps/cli
npx tauri icon path/to/your/icon.png
```

### 方法三：手动创建

**Windows (.ico):**
- 使用 IrfanView、GIMP 等工具
- 或在线工具：https://convertio.co/png-ico/

**macOS (.icns):**
```bash
# macOS 系统上
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
```

## 设计建议

### 图标主题
适合宝宝成长记录应用的图标元素：
- 👶 婴儿形象
- 📷 相机/照片
- 📅 日历
- 💝 爱心
- 🎈 气球
- 📖 相册

### 设计要点
- ✅ 简洁明了，一眼能认出应用用途
- ✅ 使用柔和的配色（粉色、蓝色、黄色等）
- ✅ 图标在小尺寸下依然清晰
- ✅ 避免过多细节，保持简洁

### 配色建议
- **粉色系**：#FFB6C1, #FF69B4, #FFC0CB
- **蓝色系**：#87CEEB, #6495ED, #4169E1
- **黄色系**：#FFD700, #FFA500, #FFEC8B
- **渐变色**：粉紫渐变、蓝绿渐变

## 临时解决方案

如果暂时没有准备图标，可以使用默认图标：

```bash
# 使用 Tauri 默认图标
# 构建时会有警告，但不影响应用运行
```

开发阶段可以先不设置图标，等应用完善后再添加。

## 图标示例

你可以在以下网站找到免费图标资源：
- https://www.flaticon.com/
- https://icons8.com/
- https://www.iconfinder.com/
- https://iconmonstr.com/

记得查看使用许可！
