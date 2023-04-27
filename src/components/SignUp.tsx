import { Button, Card, CardContent, Box, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../http/requests';
import '../App.css';
interface Props { }

const App: React.FC<Props> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignUp) {
      register(username, password, email).then((response: any) => {
        if (response!.status === 201) {
          loginFn();
        }
      })
    } else {
      loginFn();
    }
  };

  const handleSignUpClick = () => {
    setShowEmailField(!showEmailField);
    setIsSignUp(!isSignUp);
  };

  const handleLoginClick = () => {
    setShowEmailField(!showEmailField);
    setIsSignUp(!isSignUp);
  };

  const isUsernameValid = () => {
    return username.trim() === '';
  };

  const isEmailValid = () => {
    return email.trim() !== '';
  };

  const isPasswordValid = () => {
    return password.trim() === '';
  };

  function loginFn() {
    login(username, password).then((response: any) => {
      if (response!.status === 200) {
        sessionStorage.setItem('id', response!.data.id);
        sessionStorage.setItem('username', response!.data.username);
        sessionStorage.setItem('token', response!.data.token);
        navigate('/feed')
      } else {
        alert('not possible')
      }
    })
  }

  return (
<Card sx={{ minWidth: 300, maxWidth: '90%', margin: '0 auto', padding: '1rem' }}>
  <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to CodeLeap network!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Please enter your username
      </Typography>
      <Box mt={3}>
        <form onSubmit={handleFormSubmit}>
          <TextField sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }} variant="outlined" fullWidth placeholder="Username" value={username} onChange={handleUsernameChange} />
          {showEmailField && <TextField sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }} variant="outlined" fullWidth placeholder="Email" value={email} onChange={handleEmailChange} />}
          <TextField sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }} variant="outlined" fullWidth placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
          <Box sx={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button sx={{ marginRight: 0 }} fullWidth={true} variant="contained" color="primary" type="submit" disabled={!isUsernameValid || !isPasswordValid  || !isEmailValid}>
              Enter
            </Button>
            {
              !isSignUp ? (
                <Typography sx={{ margin: '1rem' }} variant="subtitle2" align="center" gutterBottom>Don't have an account?</Typography>
              ) : (
                <Typography sx={{ margin: '1rem' }} variant="subtitle2" align="center" gutterBottom>Do you have an account?</Typography>
              )
            }
            {!isSignUp ? (
              <Button sx={{ marginRight: '1rem' }} fullWidth={true} variant="contained" color="primary" type="button" onClick={handleSignUpClick}>
                Create account
              </Button>
            ) : (
              <Button sx={{ marginRight: '1rem' }} fullWidth={true} variant="contained" color="primary" type="button" onClick={handleLoginClick}>
                Log in
              </Button>
            )}
          </Box>

        </form>
      </Box>
    </Box>
  </CardContent>
</Card>

  );
};

export default App;
