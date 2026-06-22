// import { useState } from 'react';
import { Outlet, NavLink } from "react-router"; 
import './App.css' 
export function MyAppNav() {
  return (
    <nav> 
      <NavLink to="/list">Search Labels</NavLink> 
      <NavLink to="/create">Create Label</NavLink> 
    </nav>
  );
}

function App() { 
  
  return (
    <>
      <header>
        <MyAppNav/>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
 
}

export default App
