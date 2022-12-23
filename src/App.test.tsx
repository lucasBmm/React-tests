import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import '@testing-library/jest-dom'

test('renders learn react link', () => {
  render(<Provider store={store}><App /></Provider>);
  const linkElement = screen.getByLabelText('Email address');
  
  expect(linkElement).toBeInTheDocument();
});
