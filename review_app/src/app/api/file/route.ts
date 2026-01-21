import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const relPath = searchParams.get('path');
  
  if (!relPath) return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  
  const rootDir = path.resolve(process.cwd(), '..');
  // Check traversal
  const absolutePath = path.resolve(rootDir, relPath);
  if (!absolutePath.startsWith(rootDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  const { path: relPath, content } = await request.json();
    
    if (!relPath || content === undefined) return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    
    const rootDir = path.resolve(process.cwd(), '..');
    const absolutePath = path.resolve(rootDir, relPath);
     if (!absolutePath.startsWith(rootDir)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }
    
    try {
        fs.writeFileSync(absolutePath, content, 'utf-8');
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
    }
}
