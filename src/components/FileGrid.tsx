import { FileInfo } from '../types';
import { convertFileSrc } from '@tauri-apps/api/core';
import { Image as ImageIcon, Video, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

interface FileGridProps {
  files: FileInfo[];
  onSelectFile: (file: FileInfo) => void;
}

export default function FileGrid({ files, onSelectFile }: FileGridProps) {
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => (
          <div
            key={file.file_path}
            onClick={() => onSelectFile(file)}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
          >
            {/* 缩略图 */}
            <div className="aspect-square bg-gray-100 relative">
              {file.file_type === 'image' ? (
                file.thumbnail_path ? (
                  <img
                    src={convertFileSrc(file.thumbnail_path)}
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Video className="w-12 h-12 text-white" />
                </div>
              )}

              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition font-medium">
                  点击查看
                </span>
              </div>

              {/* 便利贴标记 */}
              {file.note && (
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1.5 shadow">
                  <StickyNote className="w-4 h-4 text-yellow-800" />
                </div>
              )}
            </div>

            {/* 文件信息 */}
            <div className="p-3">
              <div className="text-sm font-medium text-gray-800 truncate mb-1">
                {file.file_name}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(file.created_at)}
              </div>
              <div className="mt-1 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                {file.age_group}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
