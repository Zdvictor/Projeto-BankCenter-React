import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cpfMask } from '../Mask';
import { auth } from '../../services/firebaseConnection';
import { signInWithEmailAndPassword} from "firebase/auth"
import { toast } from 'react-toastify';
 
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to="/">
      Bank Center
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();



export default function SignIn() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [check, setCheck] = useState(false)

  const navigate = useNavigate()

  useEffect( () => {

    function DataSaved() {

      var user = JSON.parse(localStorage.getItem("@bank_centerData"))

      setEmail(user?.email)
      setPassword(user?.password)
      
      


    }

    DataSaved()

  }, [])

  const handleSubmit = (event) => {

    event.preventDefault();

    VerifyData()


  };

  async function VerifyData() {

    
    await signInWithEmailAndPassword(auth,email,password).then( (user) => {

      navigate("/account")

      if(check) {

        var data = {
  
          email,
          password
        }
  
        localStorage.setItem("@bank_centerData", JSON.stringify(data))
  
      }
      
    }).catch(err => {

      if(err.code == "auth/invalid-credential") {

        toast.error("Senha inválida")

      }

    }) 

  }

  function handleAdd(e) {

    if(e.target.name == "email") {

      setEmail(e.target.value)

    }

    if(e.target.name == "password") {

      setPassword(e.target.value)

    }

  }

  function handleChecked(e) {


    if(e.target.checked) {

      setCheck(true)

    }else {

      setCheck(false)

    }

  }



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleAdd}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              value={password}
              onChange={handleAdd}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              onChange={handleChecked}
              label="Lembrar-me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              LOGAR
            </Button>
            <Grid container>
              <Grid item xs>
                <Link style={{color: "blue", fontSize: 15}} to="/recovery" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link style={{color: "blue", fontSize: 15}} to="/register" variant="body2">
                    Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}