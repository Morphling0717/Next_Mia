"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import type { EditableSiteConfig } from '@/lib/site-config';

interface ErrorBoundaryProps {
  children: ReactNode;
  errors: EditableSiteConfig["errors"];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 以至于下一次渲染能够显示降级后的 UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    // 你同样可以将错误日志上报给服务器
    console.error("React Critical Error:", error, errorInfo);
  }

  render() {
    const errorCfg = this.props.errors;
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-(--mia-ink)/55 backdrop-blur p-10 text-(--mia-ink)">
          <div className="max-w-2xl w-full bg-(--mia-cream)/95 border border-(--mia-rose)/50 rounded-xl p-8 shadow-[0_24px_60px_-24px_rgba(184,80,106,0.45)]">
            <h2 className="text-2xl font-bold text-(--mia-rose) mb-4 flex items-center gap-2 font-display">
              {errorCfg.title}
            </h2>
            <p className="mb-4 text-(--mia-ink)/85">
              {errorCfg.message}
            </p>
            <div className="bg-(--mia-cream-soft)/85 border border-(--mia-warm-grey)/40 p-4 rounded text-sm font-mono text-(--mia-rose) overflow-auto max-h-64 mb-6">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-(--mia-rose) hover:bg-[#a64432] text-(--mia-cream) px-6 py-2 rounded-lg font-bold font-display transition-colors cursor-pointer shadow-[0_8px_18px_-10px_rgba(184,80,106,0.55)]"
            >
              {errorCfg.retryText}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
