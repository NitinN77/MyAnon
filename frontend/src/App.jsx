import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Feed from "./pages/Feed/Feed";
import Navbar from "./components/Navbar/Navbar";
import PostDetail from "./pages/PostDetail/PostDetail";
import { QueryClient, QueryClientProvider } from "react-query";

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = ["http://localhost:3000"];
    const token = localStorage.getItem("token");
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Feed />} />
            <Route path="/posts/:postId" exact element={<PostDetail />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
