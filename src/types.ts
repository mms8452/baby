export interface FileInfo {
  id?: number;
  file_path: string;
  file_name: string;
  file_type: 'image' | 'video';
  created_at: number;
  modified_at: number;
  age_group: string;
  thumbnail_path?: string;
  note?: string;
}

export interface Settings {
  baby_birth_date?: string;
  folder_path?: string;
}

export interface GroupedFiles {
  [ageGroup: string]: FileInfo[];
}
