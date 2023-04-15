import React, {useEffect} from 'react';
import './App.css';
import Dashboard from "./component/Dashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MonthlyChart from './component/MonthlyChart';
import DailyChart from './component/DailyChart';

var showToast

function App() {

  showToast=message=>{
    toast.dark(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
      <div>
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <Dashboard/>
      </div>
  );
}

export default App;
export {showToast}
