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
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cpfMask } from '../Mask';
import { auth } from '../../services/firebaseConnection';
import { sendPasswordResetEmail} from "firebase/auth"
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



export default function RecoveryPassword() {

  const [email, setEmail] = useState("")

  const navigate = useNavigate()


  const handleSubmit = (event) => {

    event.preventDefault();

    Recovery()


  };

  async function Recovery() {

    await sendPasswordResetEmail(auth, email).then((value) => {

        toast.success("Um link de redefinição de senha foi enviado para o seu e-mail.")

    }).catch(err => {

        if(err.code == "auth/invalid-email") {

            toast.error("O e-mail fornecido é inválido.")

        }else if(err.code == "auth/user-not-found") {

            toast.error("Nenhum usuário encontrado com esse e-mail.")

        }else {

            toast.error("Nenhum usuário encontrado com esse e-mail.")

        }

    })

  }

  function handleAdd(e) {


      setEmail(e.target.value)



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
            <PasswordOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Recuperação de senha
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar link de recuperação
            </Button>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}