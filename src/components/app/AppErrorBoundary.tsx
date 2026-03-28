import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';

type State = {
  hasError: boolean;
  errorMessage: string;
};

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected application error.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled render error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-[10px] uppercase tracking-[3px] text-error">App Error</Text>
        <Text className="mt-3 text-center font-headline text-2xl font-bold text-on-surface">
          Something went wrong.
        </Text>
        <Text className="mt-4 text-center text-sm leading-6 text-on-surface-variant">
          {this.state.errorMessage}
        </Text>
        <Button title="Try Again" onPress={this.handleReset} className="mt-6" />
      </View>
    );
  }
}
