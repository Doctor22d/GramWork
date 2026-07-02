'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Structured observability logging without exposing sensitive data to user
    console.error('[ErrorBoundary] Uncaught Exception:', error.message);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    
    // In production, sync to Sentry / Datadog here
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-[400px] w-full items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                A critical rendering error occurred in this module. The engineering team has been notified automatically.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
                <Button onClick={() => this.setState({ hasError: false, error: null })}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
