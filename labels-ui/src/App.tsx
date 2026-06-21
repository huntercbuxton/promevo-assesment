import { useState } from 'react'
import { Outlet } from "react-router";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import { NavLink } from "react-router";

export function MyAppNav() {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/list">List</NavLink>
      <NavLink to="/labels/:id" end>View</NavLink>
      <NavLink to="/create">Create</NavLink>
      <NavLink to="/update">Update</NavLink>
      <NavLink to="/delete">Delete</NavLink> 
    </nav>
  );
}

function App() {
  // const [count, setCount] = useState(0)

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
