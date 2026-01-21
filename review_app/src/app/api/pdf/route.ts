import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const rootDir = path.resolve(process.cwd(), '..'); 
  const pdfPath = path.join(rootDir, 'main.pdf');

  if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(pdfPath);

  return new NextResponse(fileBuffer, {
      headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="main.pdf"',
      },
  });
}
