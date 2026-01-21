import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const rootDir = path.resolve(process.cwd(), '..'); 
  
  function findTexFiles(dir: string, fileList: string[] = []) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'review_app' && !file.startsWith('.')) {
               findTexFiles(filePath, fileList);
            }
          } else {
            if (path.extname(file) === '.tex') {
               fileList.push(path.relative(rootDir, filePath));
            }
          }
        });
    } catch (e) {
        // Ignore permission errors etc
    }
    return fileList;
  }

  try {
    const files = findTexFiles(rootDir);
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
