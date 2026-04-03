import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

export function saveUploadedFile(file: Express.Multer.File, folder: string) {
  const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
  const targetDir = join(process.cwd(), uploadRoot, folder);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;
  const absolutePath = join(targetDir, filename);
  writeFileSync(absolutePath, file.buffer);
  return `/uploads/${folder}/${filename}`;
}
