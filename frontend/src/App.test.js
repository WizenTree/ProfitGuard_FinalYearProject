import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import axios from 'axios';

// 🛑 GLOBALLY MOCK AXIOS
// This intercepts all API calls across the entire app so no network requests are made during tests.
jest.mock('axios');

// Mock Recharts to prevent ResizeObserver errors in the simulated JSDOM environment
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

describe('Profit Guard Application', () => {
  
  beforeEach(() => {
    // Setup a successful default mock response for any axios.get call
    axios.get.mockResolvedValue({
      data: {
        total_profit: 5000,
        total_revenue: 15000,
        total_cost: 10000,
        top_products: [
          { product: "Test Product", total_quantity: 10 }
        ],
        items: [] // For inventory/transactions fallback
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main layout and sidebar successfully', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    // Verify the Sidebar title renders immediately
    expect(screen.getByText(/Profit Guard/i)).toBeInTheDocument();

    // ✅ FIX: Wait for the component to finish loading to clear the act() warning
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });

  test('defaults to the Dashboard view and successfully loads data', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    // ✅ FIX: Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    
    // Verify Dashboard content is visible and the mock data was applied
    const dashboardHeaders = screen.getAllByText(/Dashboard/i);
    expect(dashboardHeaders.length).toBeGreaterThan(0);
    
    // Verify the mock data successfully populated the UI
    expect(screen.getByText(/Total Profit/i)).toBeInTheDocument();
  });

});