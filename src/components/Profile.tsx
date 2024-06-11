import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";

const Profile = () => {
    const [userImage, setUserImage] = useState<any>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>("####");
    const [confirmPassword, setConfirmPassword] = useState<string>("####");
    const [isSubmitted, setIsSubmitted] = useState<boolean>();
    const [errorMessage, setErrorMessage] = useState<String>();
    const [changedFields, setChangedFields] = useState<Partial<{image:boolean, email:boolean, password:boolean}>>();
    const {authToken} = useContext(AuthContext);

    const updateUserDetails = () => {
        setIsSubmitted(true);
        if(changedFields?.image && userImage.name.slice(-4) !== ".png") setErrorMessage("photos must be in png format");
        else if(password !== confirmPassword) setErrorMessage("passwords must match");
        else if(changedFields) {
            const formData = new FormData();
            formData.append("username", username!);
            if(changedFields?.image) formData.append("file", userImage);
            if(changedFields?.email) formData.append("email", email!);
            if(changedFields?.password) formData.append("password", password);

            axios.put(`${import.meta.env.VITE_SERVER_URL}/user/updateProfile`, formData, {headers:{ 
                "Content-Type": "image/form-data" ,
                "Authorization": authToken.accessToken
            }}).then(() => {
                setErrorMessage("");
                alert("user details updated successfully");
            }).catch(() => setErrorMessage("Error updating user details"));
        }
    }

    const onFileChange = (event: any) => {
        if(event.target.files[0].name.slice(-4) !== ".png") setErrorMessage("photos must be in png format");
        else {
            setChangedFields({...changedFields, image:true})
            setUserImage(event.target.files[0]);
        }
    };

    const setImage = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/getUserImage`, {
            method: "GET",
            headers: {
              "Content-Type": "image/png",
              "Authorization": authToken.accessToken
            }
          });
          setUserImage(await response.blob());
    }

    useEffect(() => {
        setImage();
        axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getUserSettings`, {headers:{"Authorization": authToken.accessToken}}).then((res) => {
            setUsername(res.data.user.username);
            setEmail(res.data.user.email);
        });
    }, [])

    return (
        <Card sx={{ minWidth: '100vh', height: '80vh', marginTop:'5vh' }}>
            <Grid container spacing={1}>
                <Grid md={12} sx={{marginTop: 5, justifyContent:'center', alignItems: 'center', display:'flex', flexDirection:'column'}}>
                    <Box>
                        <Box component="img" src={userImage ? URL.createObjectURL(userImage) : "../../public/defaultUserImage.png"} sx={{height: 125, width: 125}}/>
                        <input type="file" onChange={onFileChange}/>
                    </Box>
                    <Typography variant="h5" sx={{margin:1}}>User name: {username}</Typography>
                    <TextField error={!email && isSubmitted} onChange={(prop) => {
                        setChangedFields({...changedFields, email:true}); 
                        setEmail(prop.target.value)}}
                         helperText="email" value={email} id="Email" variant="outlined" sx={{margin: 1, width: '50vh'}} />
                    <TextField error={!password && isSubmitted} onChange={(prop) => {
                        setChangedFields({...changedFields, password:true});
                        setPassword(prop.target.value)}}
                         helperText="password" value={password} id="Password" variant="outlined" type="password" sx={{margin: 1, width: '50vh'}} />
                    <TextField error={!confirmPassword && isSubmitted} onChange={(prop) => setConfirmPassword(prop.target.value)} helperText="confirm password" value={confirmPassword} id="Confirm password" variant="outlined" type="password" sx={{margin: 1, width: '50vh'}} />
                    <Button onClick={updateUserDetails} color="primary" variant="contained" sx={{marginRight: 20, marginLeft: 20, marginTop: 4}}>Update details</Button>
                    {errorMessage && <Typography color="red" variant="h6" gutterBottom  sx={{marginRight: 13, marginLeft: 13}}>
                        {errorMessage}
                    </Typography>}
                </Grid>
            </Grid>
        </Card>
    );
};

export default Profile;