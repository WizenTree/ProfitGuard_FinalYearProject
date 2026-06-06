// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import { render, screen } from '@testing-library/react';
import App from './App'; // Note the lowercase 'app' to match your file

test('renders the application layout', () => {
  render(<App />);
  // Assuming your Dashboard or Layout renders a specific title or text
  // Let's test for "Dashboard" or "Profit Guard"
  const textElement = screen.getByText(/Dashboard/i); 
  expect(textElement).toBeInTheDocument();
});