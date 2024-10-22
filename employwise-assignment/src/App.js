import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import UserList from "./components/UserList";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
