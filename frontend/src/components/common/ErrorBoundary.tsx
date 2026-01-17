"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Что-то пошло не так
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              Произошла ошибка при загрузке страницы. Попробуйте обновить или
              вернуться на главную.
            </p>

            {/* Error details (dev only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-muted/50 text-left">
                <p className="text-xs font-mono text-destructive break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-5 py-2.5 rounded-xl",
                  "bg-primary text-primary-foreground",
                  "font-medium text-sm",
                  "hover:bg-primary/90 transition-colors"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Попробовать снова
              </button>

              <Link
                to="/"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-5 py-2.5 rounded-xl",
                  "bg-muted text-foreground",
                  "font-medium text-sm",
                  "hover:bg-muted/80 transition-colors"
                )}
              >
                <Home className="w-4 h-4" />
                На главную
              </Link>

              <Link
                to="/products"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-5 py-2.5 rounded-xl",
                  "bg-muted text-foreground",
                  "font-medium text-sm",
                  "hover:bg-muted/80 transition-colors"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                Каталог
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary wrapper for functional components
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
