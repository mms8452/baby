import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';
import { FileInfo } from '../types';
import { X, StickyNote, Save, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

interface FilePreviewProps {
  file: FileInfo;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [note, setNote] = useState(file.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNote(file.note || '');
    setIsEditingNote(false);
  }, [file]);

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      await invoke('save_note', {
        filePath: file.file_path,
        note: note,
      });
      setIsEditingNote(false);
    } catch (error) {
      console.error('保存笔记失败:', error);
      alert('保存失败: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'yyyy年MM月dd日 HH:mm:ss');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-6xl mx-auto p-8 flex gap-6">
        {/* 媒体预览区 */}
        <div className="flex-1 flex items-center justify-center">
          {file.file_type === 'image' ? (
            <img
              src={convertFileSrc(file.file_path)}
              alt={file.file_name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <video
              src={convertFileSrc(file.file_path)}
              controls
              className="max-w-full max-h-full rounded-lg"
            >
              您的浏览器不支持视频播放
            </video>
          )}
        </div>

        {/* 信息侧边栏 */}
        <div className="w-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* 标题栏 */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">文件详情</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 文件信息 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div>
              <label className="text-sm text-gray-500">文件名</label>
              <p className="text-gray-800 font-medium break-all">{file.file_name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">拍摄时间</label>
              <p className="text-gray-800">{formatDate(file.created_at)}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">宝宝月龄</label>
              <p className="text-gray-800">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {file.age_group}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">类型</label>
              <p className="text-gray-800">
                {file.file_type === 'image' ? '图片' : '视频'}
              </p>
            </div>

            {/* 便利贴 */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  便利贴
                </label>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="w-3 h-3" />
                    编辑
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="记录这一刻的美好回忆..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={() => {
                        setNote(file.note || '');
                        setIsEditingNote(false);
                      }}
                      className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-3 min-h-[80px]">
                  {note ? (
                    <p className="text-gray-800 whitespace-pre-wrap">{note}</p>
                  ) : (
                    <p className="text-gray-400 italic">暂无笔记</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );
}
