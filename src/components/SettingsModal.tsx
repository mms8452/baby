import { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Settings } from '../types';
import { X, FolderOpen } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [birthDate, setBirthDate] = useState(settings.baby_birth_date || '');
  const [folderPath, setFolderPath] = useState(settings.folder_path || '');

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        setFolderPath(selected as string);
      }
    } catch (error) {
      console.error('选择文件夹失败:', error);
    }
  };

  const handleSave = () => {
    if (!birthDate) {
      alert('请设置宝宝出生日期');
      return;
    }
    if (!folderPath) {
      alert('请选择文件夹');
      return;
    }

    onSave({
      baby_birth_date: birthDate,
      folder_path: folderPath,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">设置</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="px-6 py-4 space-y-4">
          {/* 出生日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宝宝出生日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 文件夹路径 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              照片/视频文件夹 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={folderPath}
                readOnly
                placeholder="点击右侧按钮选择文件夹"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={handleSelectFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                选择
              </button>
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">提示：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>设置出生日期后，照片会按宝宝月龄自动分类</li>
              <li>支持的图片格式：JPG、PNG、GIF、BMP、WebP、HEIC</li>
              <li>支持的视频格式：MP4、MOV、AVI、MKV、WMV、FLV、WebM</li>
            </ul>
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
