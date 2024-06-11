import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [userImage, setUserImage] = useState<any>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isSubmitted, setIsSubmitted] = useState<boolean>();
    const [errorMessage, setErrorMessage] = useState<String>();
    const navigate = useNavigate();

    const signupNewUser = () => {
        setIsSubmitted(true);
        if(!userImage) setErrorMessage("You must enter a profile picture");
        else if(password !== confirmPassword) setErrorMessage("passwords must match");
        else if(userImage.name.slice(-4) !== ".png") setErrorMessage("photos must be in png format");
        else if(username && email && password && password === confirmPassword){
            const formData = new FormData();
            formData.append("file", userImage);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            
            axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, formData, {headers:{ "Content-Type": "image/form-data" }}).then(() => {
                setErrorMessage("");
                navigate("/");
            }).catch(() => setErrorMessage("Username already exists"));
        }
    }

    const onFileChange = (event: any) => {   
        setUserImage(event.target.files[0]);
    };

    return (
        <Card sx={{ minWidth: '100vh', height: '75vh', marginTop:'5vh' }}>
            <Grid container spacing={1}>
                <Grid md={12} sx={{marginTop: 5, justifyContent:'center', alignItems: 'center', display:'flex', flexDirection:'column'}}>
                    <Box>
                        <Box component="img" src={userImage ? URL.createObjectURL(userImage) : "../../public/defaultUserImage.png"} sx={{height: 125, width: 125}}/>
                        <input type="file" onChange={onFileChange}/>
                    </Box>
                    <TextField error={!username && isSubmitted} onChange={(prop) => setUsername(prop.target.value)} id="Username" label="Username" variant="outlined" sx={{margin: 1, width: '50vh'}} />
                    <TextField error={!email && isSubmitted} onChange={(prop) => setEmail(prop.target.value)} id="Email" label="Email" variant="outlined" sx={{margin: 1, width: '50vh'}} />
                    <TextField error={!password && isSubmitted} onChange={(prop) => setPassword(prop.target.value)} id="Password" label="Password" variant="outlined" type="password" sx={{margin: 1, width: '50vh'}} />
                    <TextField error={!confirmPassword && isSubmitted} onChange={(prop) => setConfirmPassword(prop.target.value)} id="Confirm password" label="Confirm password" variant="outlined" type="password" sx={{margin: 1, width: '50vh'}} />
                    <Button onClick={signupNewUser} color="primary" variant="contained" sx={{marginRight: 20, marginLeft: 20, marginTop: 4}}>Sign up</Button>
                    {errorMessage && <Typography color="red" variant="h6" gutterBottom  sx={{marginRight: 13, marginLeft: 13}}>
                        {errorMessage}
                    </Typography>}
                </Grid>
            </Grid>
        </Card>
    );
};

export default Signup;