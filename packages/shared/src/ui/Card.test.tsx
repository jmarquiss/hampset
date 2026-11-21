import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  it('renders a subtitle when no title or action is provided', () => {
    render(<Card subtitle="Additional context" />);
    expect(screen.getByText('Additional context')).toBeTruthy();
  });
});
