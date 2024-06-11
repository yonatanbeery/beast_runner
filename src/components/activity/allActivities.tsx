import {  useContext, useEffect, useState } from 'react';
import '../styles/postsPage.css';
import {AuthContext} from "../../App";
import Login from "../Login";
import axios from 'axios';

interface SessionsResponse {
    deletedSession: Session[];
    nextPageToken: string;
    session: Session[];
}

interface Session {
    activityType: number;
    application: {packageName: string, version: string, detailsUrl: string}
    description: string
    endTimeMillis: string
    id: string
    modifiedTimeMillis: string
    name: string
    startTimeMillis: string
}

const ActivitiesPage = () => {
    const {authToken} = useContext(AuthContext);
    const [runningSessions, setRunningSessions] = useState<SessionsResponse>();
    
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
    }, [authToken])



    return (
        authToken.accessToken ? 
            <>
            <h3>
            you are logged in, your access token is: {authToken.accessToken}.
            </h3>
            <h4>
            Latest running sessions are: {runningSessions?.session.map((session) => <div key={session.id}>name: {session.name}, startTimeMillis: {session.startTimeMillis}, endTimeMillis: {session.endTimeMillis}</div>)}
            </h4>
            </>
            :  <Login/>

    );
};

export default ActivitiesPage;