'use client';
import DashBoard from './page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Innerlayout({children}) {
  return (
    <div>
      <DashBoard>
        <ToastContainer/>
        {children}
      </DashBoard>
    </div>
  )
}
