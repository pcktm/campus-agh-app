import React, {Component, ErrorInfo, ReactNode} from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('[getDerivedStateFromError] Uncaught error in:', error);
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[componentDidCatch] Uncaught error:', error, errorInfo);
  }

  render(): ReactNode {
    const {hasError} = this.state;
    const {children} = this.props;

    if (hasError) {
      return <h1>Coś poszło naprawdę nie tak - odśwież stronę lub zamknij i otwórz aplikację.</h1>;
    }

    return children;
  }
}
