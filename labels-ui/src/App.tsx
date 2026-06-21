// import { useState } from 'react';
import { Outlet, NavLink } from "react-router"; 
import './App.css' 
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
