import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome screen', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /deckhand/i })).toBeInTheDocument();
});
