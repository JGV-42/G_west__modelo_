'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Check, X, File, MessageSquare, RefreshCw, Smartphone, Eye } from 'lucide-react';

import * as Diff from 'diff';

interface Proposal {
    file: string;
    originalContent: string; // Might be empty if not sent
    proposedContent: string;
    reason: string;
    timestamp: number;
}

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('/api/pdf');
  
  // Initial load
  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => setFiles(data.files || []));
  }, []);

  // Poll for proposals
  useEffect(() => {
      const checkProposals = async () => {
          try {
              const res = await fetch(`/api/proposal${selectedFile ? `?file=${encodeURIComponent(selectedFile)}` : ''}`);
              const data = await res.json();
              if (data.proposal) {
                  // Only update if it's new or different
                  setProposal(prev => {
                      if (!prev || prev.timestamp !== data.proposal.timestamp) {
                          return data.proposal;
                      }
                      return prev;
                  });
                  // If we received a proposal for a file we haven't selected, select it?
                  // Maybe better to just notify. For now let's auto-select if nothing is selected or it matches.
                  if (!selectedFile && data.proposal.file) {
                      loadFile(data.proposal.file);
                  }
                  
                  // Trigger PDF Preview Generation automatically
                  if (data.proposal) {
                      generatePdfPreview(data.proposal);
                  }
              } else {
                 if (proposal) setProposal(null); 
              }
          } catch(e) {/* ignore */}
      };

      const interval = setInterval(checkProposals, 2000);
      return () => clearInterval(interval);
  }, [selectedFile, proposal]);

  const loadFile = async (path: string) => {
    setSelectedFile(path);
    setIsLoading(true);
    try {
        const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
        const data = await res.json();
        setContent(data.content || '');
    } catch(e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const acceptProposal = async () => {
    if (!proposal || !selectedFile) return;
    
    await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile, content: proposal.proposedContent })
    });
    
    // Clear proposal
    await fetch('/api/proposal', { method: 'DELETE' });
    
    setContent(proposal.proposedContent);
    setProposal(null);
  };

  const rejectProposal = async () => {
      await fetch('/api/proposal', { method: 'DELETE' });
      setProposal(null);
  };

  const generatePdfPreview = async (prop: Proposal) => {
      // Don't generate if we already have. naive check
      try {
        await fetch('/api/pdf/preview', {
            method: 'POST',
            body: JSON.stringify({
                filePath: prop.file,
                original: prop.originalContent,
                proposed: prop.proposedContent
            })
        });
        // Refresh PDF
        setPdfUrl(`/api/pdf?t=${Date.now()}`);
        if (!showPdf) setShowPdf(true);
      } catch (e) {
          console.error("Failed to generate preview", e);
      }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
           ANTIGRAVITY <span className="text-blue">REVIEW</span>
        </div>
        <div className="file-list">
            {files.map(f => (
                <div key={f} 
                     onClick={() => loadFile(f)}
                     className={`file-item ${selectedFile === f ? 'active' : ''} ${proposal && proposal.file === f ? 'has-proposal' : ''}`}>
                    <File size={14} className="shrink-0" />
                    <span className="truncate">{f}</span>
                    {proposal && proposal.file === f && <span className="pulse-dot-small" title="Active Proposal"></span>}
                </div>
            ))}
        </div>
      </div>

      <div className="main-panel">
        
        {/* Top Info Bar */}
         {selectedFile && (
            <div className="toolbar justify-between">
                <div className="flex items-center gap-2 font-mono text-sm text-gray-400">
                    <File size={14}/>
                    {selectedFile}
                </div>
                {/* Status */}
                <div className="flex items-center gap-2">
                    {proposal ? (
                         <span className="badge badge-blue animate-pulse">
                            Review Ready
                         </span>
                    ) : (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-900"></span>
                             Waiting for agent...
                        </span>
                    )}
                </div>
                <button 
                    onClick={() => {
                        if (!showPdf) setPdfUrl(`/api/pdf?t=${Date.now()}`); // Refresh PDF on open
                        setShowPdf(!showPdf);
                    }}
                    className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-md border ${showPdf ? 'bg-blue-900/30 text-blue-200 border-blue-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
                >
                    <Eye size={12} />
                    {showPdf ? 'Hide PDF' : 'Show PDF'}
                </button>
            </div>
         )}

         {/* Reason Banner */}
         {proposal && (
             <div className="reason-banner">
                 <div className="reason-icon">
                    <MessageSquare size={18} />
                 </div>
                 <div className="reason-content">
                    <div className="reason-label">Agent's Reasoning</div>
                    <div className="reason-text">{proposal.reason}</div>
                 </div>
             </div>
         )}


        <div className="content-area flex relative">
            <div className={`h-full overflow-hidden flex flex-col transition-all duration-300 ${showPdf ? 'w-half border-r border-white/10' : 'w-full'}`}>
                {!selectedFile ? (
                     <div className="empty-state">
                        <div className="text-center">
                            <div className="mb-4 opacity-20"><Smartphone size={48} /></div>
                            <p>Select a file to view.</p>
                            <p className="text-xs opacity-50 mt-2">Ask the agent in chat to review a specific file.</p>
                        </div>
                    </div>
                ) : (
                    isLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-600">Loading...</div>
                    ) : (
                        proposal ? (
                            <DiffViewer original={content} modified={proposal.proposedContent} />
                        ) : (
                            <textarea 
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="editor-textarea"
                                spellCheck={false}
                            />
                        )
                    )
                )}
            </div>
            
            {/* PDF Panel */}
            {showPdf && (
                <div className="w-half h-full bg-neutral-900 flex flex-col relative">
                     <div className="absolute top-2 right-2 z-10">
                        <a href="/api/pdf" target="_blank" className="text-xs text-gray-500 hover:text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                            Open in New Tab
                        </a>
                     </div>
                    <iframe 
                        src={pdfUrl} 
                        className="w-full h-full border-none bg-white" 
                        title="PDF Preview"
                    />
                </div>
            )}
        </div>
        
        {/* Action Bar */}
        {proposal && (
            <div className="action-bar">
                <div className="mode-indicator">
                    <span className="pulse-dot"></span>
                    Comparison Mode
                </div>
                <div className="action-buttons">
                    <button onClick={rejectProposal} className="btn btn-secondary">
                        <X size={16} /> REJECT
                    </button>
                    <button onClick={acceptProposal} className="btn btn-success">
                        <Check size={16} /> ACCEPT CHANGES
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

function DiffViewer({ original, modified }: { original: string, modified: string }) {
    const changes = Diff.diffLines(original, modified);
    
    return (
        <div className="diff-container">
            {changes.map((part, index) => {
                let className = 'diff-line';
                if (part.added) className += ' diff-added';
                else if (part.removed) className += ' diff-removed';
                else className += ' diff-unchanged'; 

                // Basic highlighting for LaTeX comments to make them less distracting
                const isComment = part.value.trim().startsWith('%');
                if (isComment && !part.added && !part.removed) className += ' opacity-50';

                return (
                    <span key={index} className={className}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}
