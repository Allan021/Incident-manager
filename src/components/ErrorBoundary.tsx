'use client'

import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[section error]', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
