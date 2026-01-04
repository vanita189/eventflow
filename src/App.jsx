
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GlobalSnackbar from "./components/GlobalSnackbar"

function App() {

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <AuthProvider>
        <BrowserRouter>
          <GlobalSnackbar />   {/* ✅ ADD HERE */}

          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </LocalizationProvider>


  )
}

export default App
