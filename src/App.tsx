import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { TaskList } from './components/TaskList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme with primary color matching your tailwind config
const theme = createTheme({
  palette: {
    primary: {
      main: '#22c55e', // primary-500 from your tailwind config
    },
    background: {
      default: '#f9fafb', // similar to bg-gray-50
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="min-h-screen">
          <TaskList />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;