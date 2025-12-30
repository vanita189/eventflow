
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </LocalizationProvider>


  )
}

export default App
