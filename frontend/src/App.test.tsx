import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import NovoAlbum from './pages/NovoAlbum';
import EditarAlbum from './pages/EditarAlbum';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
