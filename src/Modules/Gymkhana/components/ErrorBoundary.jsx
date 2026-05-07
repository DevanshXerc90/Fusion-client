import React from 'react';
import { Container, Title, Text, Code } from '@mantine/core';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container mt="xl">
          <Title order={2} color="red">Something went wrong.</Title>
          <Text my="md">{this.state.error?.toString()}</Text>
          <Code block>{this.state.errorInfo?.componentStack}</Code>
        </Container>
      );
    }
    return this.props.children;
  }
}
