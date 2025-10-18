import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/routes/routes';
import { store } from './core/store/store';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </Provider>
  );
}

export default App;
