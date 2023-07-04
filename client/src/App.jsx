import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import Register from './pages/Register';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
        });
      // Todo: get user data from server
    }
  }, []);


  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true} sx={{ justifyContent: 'space-between' }}>
            <Link to="/">
              <Typography variant="h6" component="div">
                Learning
              </Typography>
            </Link>
            <Typography>
              <Link to="/tutorials">Tutorials</Link>
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            {user ? (
              <>
                <Typography>{user.name}</Typography>
                <Button onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Typography>Register</Typography>
                </Link>
                <Link to="/login">
                  <Typography>Login</Typography>
                </Link>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Tutorials />} />
          <Route path={"/tutorials"} element={<Tutorials />} />
          <Route path={"/addtutorial"} element={<AddTutorial />} />
          <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </Router>
    </UserContext.Provider>
    
  );
}
export default App;