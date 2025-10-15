import { FileInfo, GroupedFiles } from '../types';
import { Baby, Image, Video } from 'lucide-react';

interface SidebarProps {
  ageGroups: string[];
  groupedFiles: GroupedFiles;
  selectedAgeGroup: string | null;
  onSelectAgeGroup: (ageGroup: string | null) => void;
}

export default function Sidebar({
  ageGroups,
  groupedFiles,
  selectedAgeGroup,
  onSelectAgeGroup,
}: SidebarProps) {
  const getTotalCount = (files: FileInfo[]) => {
    const images = files.filter(f => f.file_type === 'image').length;
    const videos = files.filter(f => f.file_type === 'video').length;
    return { images, videos, total: files.length };
  };

  const allFiles = Object.values(groupedFiles).flat();
  const allCount = getTotalCount(allFiles);

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Baby className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-semibold text-gray-800">成长阶段</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 全部文件 */}
        <button
          onClick={() => onSelectAgeGroup(null)}
          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b ${
            selectedAgeGroup === null ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          }`}
        >
          <div className="font-medium text-gray-800">全部文件</div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Image className="w-3 h-3" />
              {allCount.images}
            </span>
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              {allCount.videos}
            </span>
            <span>共 {allCount.total}</span>
          </div>
        </button>

        {/* 年龄组列表 */}
        {ageGroups.map(ageGroup => {
          const count = getTotalCount(groupedFiles[ageGroup]);
          return (
            <button
              key={ageGroup}
              onClick={() => onSelectAgeGroup(ageGroup)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b ${
                selectedAgeGroup === ageGroup ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="font-medium text-gray-800">{ageGroup}</div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  {count.images}
                </span>
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  {count.videos}
                </span>
                <span>共 {count.total}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
