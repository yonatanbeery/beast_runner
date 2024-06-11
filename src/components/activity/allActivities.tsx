import {  useContext } from 'react';
import '../styles/postsPage.css';
import {AuthContext} from "../../App";
import Login from "../Login";

const ActivitiesPage = () => {
    const {authToken} = useContext(AuthContext);

    return (
        authToken.accessToken ? 
            <>
            you are logged in, your access token is: {authToken.accessToken}
            </>
            :  <Login/>

    );
};

export default ActivitiesPage;