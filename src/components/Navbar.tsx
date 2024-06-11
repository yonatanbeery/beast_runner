import { IconButton,Link,Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import './styles/navbar.css'
import { MenuItem, Menu } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {authToken, setAuthToken} = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["accessToken", "refreshToken", "userId"]);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    const logout = () => {
       axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {} ,{headers:{
            authorization: authToken.refreshToken
        }});
        setCookie("accessToken", "", { path: "/" });
        setCookie("refreshToken", "", { path: "/"});
        setCookie("userId", "", { path: "/"});
        setAuthToken({accessToken:"", refreshToken:"", userId: ""});
        handleClose();
    }

    return (
    <AppBar className="appBar">
    <Toolbar>
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      {cookies.refreshToken &&
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem>
          <Link underline="none" color="black" href='/Profile'>My Profile</Link>
        </MenuItem>
        <MenuItem onClick={logout}>
        <Link underline="none" color="black" href='/'>Log out</Link>
          </MenuItem>
      </Menu>}
      <Typography className='title' variant="h4">
        Beast Runner
      </Typography>
    </Toolbar>
  </AppBar>
    );
};

export default Navbar;