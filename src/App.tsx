import { createContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import './App.css'
import ActivitiesPage from './components/activity/allActivities';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './components/Signup';
import Profile from './components/Profile';
import axios from 'axios';
import { useCookies } from "react-cookie";
import moment from 'moment';

export type authTokenType = {accessToken:string, refreshToken:string, userId: string}

export const AuthContext = createContext<{authToken: authTokenType, setAuthToken: any}>(
  {authToken: {accessToken:"", refreshToken:"", userId: ""}, setAuthToken: null});
export const CitiesContext = createContext<{cities: string[]}>({cities: []});

const router = createBrowserRouter([
  {
    path: "/",
    element: <ActivitiesPage/>,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
]);

function App() {
  const [cookies, setCookie] = useCookies(["accessToken", "refreshToken", "userId"]);
  const [authToken, setAuthToken] = useState<authTokenType>({accessToken:cookies.accessToken, userId: cookies.userId, refreshToken:cookies.refreshToken});

  useEffect(() => {
    if(authToken.accessToken && authToken.refreshToken) {
      setTimeout(() => {        
        axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/refreshToken`, {} ,{headers:{
            authorization: authToken.refreshToken
        }}).then((res) => {
            console.log("refreshed", res.data);
            setCookie("accessToken", res.data.accessToken, { path: "/" , expires: moment().add(1, 'h').toDate()});
            setCookie("refreshToken", res.data.refreshToken, { path: "/"});
            setAuthToken({accessToken: res.data.accessToken, refreshToken:res.data.refreshToken, userId:res.data.userId} );
        }); 
      }, 3600 * 1000 - 10000);
    }
  }, [authToken])


  return (
    <div>
      <AuthContext.Provider value={{authToken, setAuthToken}}>
          <Navbar /> 
          <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  )
}

export default App
