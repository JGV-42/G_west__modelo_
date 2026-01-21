import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as Diff from 'diff';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { filePath, original, proposed } = body;

        if (!filePath || original === undefined || proposed === undefined) {
             return NextResponse.json({ error: 'Missing args' }, { status: 400 });
        }

        const rootDir = path.resolve(process.cwd(), '..');
        const absolutePath = path.resolve(rootDir, filePath);

        // 1. Calculate Diff to Latex
        const changes = Diff.diffWords(original, proposed);
        let latexDiff = '';

        changes.forEach(part => {
             const value = part.value;
             if (part.added) {
                 // Wrap with \added{}, handle newlines
                 latexDiff += `\\added{${value.replace(/\n/g, ' ')}}`; 
             } else if (part.removed) {
                 // Wrap with \deleted{}, handle newlines safely for ulem
                 // ulem \sout cannot handle full paragraphs well, so we might need to be careful
                 // For now, let's just replace newlines with spaces in deleted blocks to avoid compilation errors
                 latexDiff += `\\deleted{${value.replace(/\n/g, ' ')}}`;
             } else {
                 latexDiff += value;
             }
        });

        // 2. Backup
        if (fs.existsSync(absolutePath)) {
            fs.copyFileSync(absolutePath, `${absolutePath}.bak`);
        }

        // 3. Write Diffed Content
        fs.writeFileSync(absolutePath, latexDiff, 'utf-8');

        // 4. Compile
        // running compile.sh in rootDir
        // We use a timeout or basic exec
        try {
            // Adjust this command to your specific compile script
            // -interaction=nonstopmode is crucial to not hang on errors
            await execPromise('pdflatex -interaction=nonstopmode main.tex', { 
                cwd: rootDir,
                timeout: 60000 
            });
            // Run biber if needed? usually pdflatex is enough for visual preview of text
        } catch (compileErr) {
            console.error('Compilation failed (might be non-fatal)', compileErr);
            // restore backup even if failed
        }

        // 5. Restore
        if (fs.existsSync(`${absolutePath}.bak`)) {
            fs.renameSync(`${absolutePath}.bak`, absolutePath);
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
