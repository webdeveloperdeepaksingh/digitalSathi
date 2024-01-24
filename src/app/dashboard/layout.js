'use client';
import DashBoard from './page';
  

export default function Innerlayout({children}) {

  return (
    <div>
      <DashBoard>
        {children}
      </DashBoard>
     </div>
  )
}
