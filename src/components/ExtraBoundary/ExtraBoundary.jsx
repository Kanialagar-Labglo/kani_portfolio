import { Component } from 'react';

// Wraps a lazily loaded extra (ADR-0006). If its code cannot be downloaded or it fails to render,
// the extra is left out and the rest of the page keeps working.
// A class component because React has no hook for catching render errors.
export default class ExtraBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
