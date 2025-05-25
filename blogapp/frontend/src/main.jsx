import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import App from './App';
import { NotificationProdiver } from './contexts/NotificationProvider';
import { UserProdiver } from './contexts/UserProvider';

import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProdiver>
          <NotificationProdiver>
            <CssBaseline>
              <App />
            </CssBaseline>
          </NotificationProdiver>
        </UserProdiver>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
