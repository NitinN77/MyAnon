import axios from "axios";
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Feed from "./pages/Feed/Feed";
import Navbar from "./components/Navbar/Navbar";
import PostDetail from "./pages/PostDetail/PostDetail";
import { QueryClient, QueryClientProvider } from "react-query";
import Cookies from 'universal-cookie';
 
const cookies = new Cookies();

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [import.meta.env.VITE_API_URL];
    const token = cookies.get("token");
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
      <div>
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
      <ReactQueryDevtools intialIsOpen={false} position='bottom-right'/>
    </QueryClientProvider>
  );
}

export default App;
