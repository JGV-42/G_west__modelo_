import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROPOSALS_FILE = path.resolve(process.cwd(), 'active_proposal.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedFile = searchParams.get('file');

  try {
    if (!fs.existsSync(PROPOSALS_FILE)) {
      return NextResponse.json({ proposal: null });
    }
    
    // Read directly from file
    const data = fs.readFileSync(PROPOSALS_FILE, 'utf-8');
    const proposal = JSON.parse(data);

    // If a specific file is requested, only return if it matches
    if (requestedFile && proposal.file !== requestedFile) {
       return NextResponse.json({ proposal: null });
    }

    return NextResponse.json({ proposal });
  } catch (err) {
    return NextResponse.json({ proposal: null });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file, originalContent, proposedContent, reason } = body;
    
    if (!file || !proposedContent) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const proposal = {
        file,
        originalContent: originalContent || '', // Optional, frontend can load it
        proposedContent,
        reason: reason || 'Optimization and improvements.',
        timestamp: Date.now()
    };

    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposal, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
  }
}

export async function DELETE() {
    try {
        if (fs.existsSync(PROPOSALS_FILE)) {
            fs.unlinkSync(PROPOSALS_FILE);
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to clear proposal'}, { status: 500 });
    }
}
