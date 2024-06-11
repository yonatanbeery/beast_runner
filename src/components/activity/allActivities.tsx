import {  useContext, useEffect, useState } from 'react';
import '../styles/postsPage.css';
import {AuthContext} from "../../App";
import Login from "../Login";
import axios from 'axios';

const ActivitiesPage = () => {
    const {authToken} = useContext(AuthContext);
    const [runningSession, setRunningSessions] = useState();
    
    const fetchSessions = async () => {
        console.log("fetching sessions");
        axios.get(`https://www.googleapis.com/fitness/v1/users/me/sessions?pageToken=`, {headers:{
            authorization: `Bearer ${authToken.refreshToken}`
        }}).then((res) => {
            console.log(res.data);
            setRunningSessions(res.data);
        })
    }

    useEffect(() => {
        fetchSessions()
    }, [])



    return (
        authToken.accessToken ? 
            <>
            <h3>
            you are logged in, your access token is: {authToken.accessToken}.
            </h3>
            <h4>
            Latest running sessions are: {runningSession}
            </h4>
            </>
            :  <Login/>

    );
};

export default ActivitiesPage;