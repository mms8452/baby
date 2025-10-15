import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { Settings as SettingsIcon, FolderOpen, Calendar, Loader2 } from 'lucide-react';
import { FileInfo, Settings, GroupedFiles } from './types';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import SettingsModal from './components/SettingsModal';
import FilePreview from './components/FilePreview';

function App() {
  const [settings, setSettings] = useState<Settings>({});
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [groupedFiles, setGroupedFiles] = useState<GroupedFiles>({});
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  // 加载文件
  useEffect(() => {
    if (settings.folder_path && settings.baby_birth_date) {
      loadFiles();
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      const loadedSettings = await invoke<Settings>('get_settings');
      setSettings(loadedSettings);
      
      // 如果没有设置，显示设置对话框
      if (!loadedSettings.baby_birth_date || !loadedSettings.folder_path) {
        setShowSettings(true);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const loadedFiles = await invoke<FileInfo[]>('get_all_files');
      setFiles(loadedFiles);
      groupFilesByAge(loadedFiles);
    } catch (error) {
      console.error('加载文件失败:', error);
    }
  };

  const groupFilesByAge = (fileList: FileInfo[]) => {
    const grouped: GroupedFiles = {};
    fileList.forEach(file => {
      if (!grouped[file.age_group]) {
        grouped[file.age_group] = [];
      }
      grouped[file.age_group].push(file);
    });
    setGroupedFiles(grouped);
  };

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        const folderPath = selected as string;
        await invoke('save_settings', { folderPath });
        setSettings({ ...settings, folder_path: folderPath });
        scanFolder(folderPath);
      }
    } catch (error) {
      console.error('选择文件夹失败:', error);
    }
  };

  const scanFolder = async (folderPath?: string) => {
    const pathToScan = folderPath || settings.folder_path;
    if (!pathToScan) {
      alert('请先选择文件夹');
      return;
    }

    setIsLoading(true);
    try {
      const scannedFiles = await invoke<FileInfo[]>('scan_folder', {
        folderPath: pathToScan,
        birthDate: settings.baby_birth_date,
      });
      
      setFiles(scannedFiles);
      groupFilesByAge(scannedFiles);

      // 批量生成缩略图
      generateThumbnails(scannedFiles);
    } catch (error) {
      console.error('扫描文件夹失败:', error);
      alert('扫描文件夹失败: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateThumbnails = async (fileList: FileInfo[]) => {
    // 只为图片生成缩略图
    const imageFiles = fileList.filter(f => f.file_type === 'image');
    
    for (const file of imageFiles) {
      try {
        const thumbnailPath = await invoke<string>('generate_thumbnail', {
          filePath: file.file_path,
        });
        
        // 更新文件信息
        setFiles(prev => prev.map(f => 
          f.file_path === file.file_path 
            ? { ...f, thumbnail_path: thumbnailPath }
            : f
        ));
      } catch (error) {
        console.error('生成缩略图失败:', file.file_name, error);
      }
    }
  };

  const handleSaveSettings = async (newSettings: Settings) => {
    try {
      await invoke('save_settings', {
        babyBirthDate: newSettings.baby_birth_date,
        folderPath: newSettings.folder_path,
      });
      setSettings(newSettings);
      setShowSettings(false);

      // 如果文件夹路径变化，重新扫描
      if (newSettings.folder_path && newSettings.folder_path !== settings.folder_path) {
        scanFolder(newSettings.folder_path);
      } else if (newSettings.baby_birth_date !== settings.baby_birth_date) {
        // 如果只是出生日期变化，重新扫描以更新年龄组
        scanFolder();
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置失败: ' + error);
    }
  };

  const displayedFiles = selectedAgeGroup
    ? groupedFiles[selectedAgeGroup] || []
    : files;

  const ageGroups = Object.keys(groupedFiles).sort((a, b) => {
    // 自定义排序逻辑
    const parseAgeGroup = (ag: string) => {
      if (ag === '出生前') return -1;
      if (ag === '未知' || ag === '未设置出生日期') return 999999;
      
      const match = ag.match(/(\d+)岁?(\d+)?月?/);
      if (match) {
        const years = parseInt(match[1] || '0');
        const months = parseInt(match[2] || '0');
        return years * 12 + months;
      }
      return 0;
    };
    
    return parseAgeGroup(a) - parseAgeGroup(b);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <Sidebar
        ageGroups={ageGroups}
        groupedFiles={groupedFiles}
        selectedAgeGroup={selectedAgeGroup}
        onSelectAgeGroup={setSelectedAgeGroup}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">宝宝成长记录</h1>
            {settings.baby_birth_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>出生日期: {settings.baby_birth_date}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectFolder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              disabled={isLoading}
            >
              <FolderOpen className="w-4 h-4" />
              选择文件夹
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <SettingsIcon className="w-4 h-4" />
              设置
            </button>
          </div>
        </div>

        {/* 文件网格 */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">正在扫描文件...</p>
            </div>
          </div>
        ) : displayedFiles.length > 0 ? (
          <FileGrid files={displayedFiles} onSelectFile={setSelectedFile} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">还没有文件</p>
              <p className="text-sm">请点击"选择文件夹"来扫描宝宝的照片和视频</p>
            </div>
          </div>
        )}
      </div>

      {/* 设置对话框 */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 文件预览 */}
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

export default App;
