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
import { cpfMask } from '../Mask';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Link , useNavigate} from 'react-router-dom';
import { db, auth } from '../../services/firebaseConnection';
import { setDoc, doc, query, where, collection, getDoc, getDocs } from 'firebase/firestore';
import {createUserWithEmailAndPassword} from "firebase/auth"
import { toast } from 'react-toastify';
import validator from "validator"
import BasicDatePicker from '../date';
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";

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


const defaultTheme = createTheme();

export default function SignUp() {

  const [name, setName] = useState("")
  const [document, setDocumentId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)

  const {cpf, setCpf, setLogado, setUser} = useContext(DataContext)
  const navigate = useNavigate()

  useEffect( () => {

     function changeCpf() {

      setDocumentId(cpf)

    }

    changeCpf()


    return () => {

      setCpf("")

    }

  }, [useState, useContext] )


  const handleSubmit = (event) => {

    event.preventDefault();

    VerifyData()
    

  };

  function handleChange(e) {


    if(e.target.name == "firstName") {

      setName(e.target.value)

    }

    else if(e.target.name == "cpf") {

      setDocumentId(cpfMask(e.target.value))

    }

    else if(e.target.name == "email") {

      setEmail(e.target.value)

    }

    else if(e.target.name == "password") {

      setPassword(e.target.value)

    }else if(e.target.name == "confirmpassword") {

      setConfirmPassword(e.target.value)

    }

    console.log(date, confirmPassword)
    


  }

  function fixDate() {

    const birthDateObj = new Date(date);
    const today = new Date(); 
    var age = today.getFullYear() - birthDateObj.getFullYear(); 
    const monthDifference = today.getMonth() - birthDateObj.getMonth();


    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {

      age--;

    }

  
    if (age >= 18) {
 
      return true

    } else {

      return false

    }



  }

  function VerifyData() {

    if(name == "" || name == " " || name.length < 4) {

      toast.error("Nome inválido")

      return


    }else if(document == "" ||  document == " " || document.length < 14) {

      toast.error("CPF inválido")

      return

    }else if(!validator.isEmail(email)) {

      toast.error("Email inválido")

      return

    }else if(password == "" || password == " " || password.length < 5) {
      
      toast.error("Senha inválida")

      return

    }else if(confirmPassword !== password) {
      
    toast.error("Confirme a Mesma Senha")

    return

  }else if(date == "" || date == " ") {

      toast.error("Data Invalida")

      return

  }

  var isOfAge = fixDate()

  if(!isOfAge) {

    toast.error("Menor de Idade")
    return
  }
    
    setLoading(true)

    SignUp()

  }

  async function SignUp() {

    var q = query(collection(db, "users"), where("cpf", "==", document ))
    var snapshot = await getDocs(q)

    if(!snapshot.empty) {

      toast.error("CPF já cadastrado.")
      setLoading(false)
      return

    }

    await createUserWithEmailAndPassword(auth, email,password).then( async (value) => {

        var uid = value.user.uid

        await setDoc(doc(db, "users", uid), {

          name: name,
          cpf: document,
          saldo: 10,
          birthDate: date

        }).then( () => {

          toast.success("Usuário cadastrado com sucesso!")
          setName("")
          setEmail("")
          setDocumentId("")
          setPassword("")
          setLoading(false)
          navigate("/account")

        })

    }).catch(err => {

      setLoading(false)

      if(err.code == "auth/weak-password") {

        toast.error("Senha Fraca")

      }else if(err.code == "auth/email-already-in-use") {

        toast.error("O e-mail informado já está cadastrado.")

      }

      console.log(err)
  

    })
    

  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Cadastro
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome Completo"
                  autoFocus
                  value={name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="cpf"
                  label="CPF"
                  name="cpf"
                  autoComplete="cpf"
                  value={document}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleChange}
                />

                {!showPassword ? ( <BiSolidShow onClick={() => setShowPassword(!showPassword)} size={25} style={{position: 'absolute', marginTop: 15, marginLeft: 2, cursor: 'pointer'}}  />  ) :  (<FaEyeSlash onClick={() => setShowPassword(!showPassword)} size={20} style={{position: 'absolute', marginTop: 18, marginLeft: 5, cursor: 'pointer'}} /> ) }

                

                <TextField
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleChange}
                  style={{marginTop: 15}}
                />

                 {
                 !showConfirmPassword ?
                  ( 
                  <BiSolidShow onClick={() => setConfirmShowPassword(!showConfirmPassword)} size={25} style={{position: 'absolute', marginTop: 30, marginLeft: 2, cursor: 'pointer'}}  />  
                  ) :  
                  (
                  <FaEyeSlash onClick={() => setConfirmShowPassword(!showConfirmPassword)} size={20} style={{position: 'absolute', marginTop: 30, marginLeft: 5, cursor: 'pointer'}} /> 
                  )
                   }

                <input
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: "100%",
                    height: 45,
                    padding: 13,
                    fontSize: 18,
                    marginTop: 15,
                    outline: "none"
                    
                  }}
                  type="date"
                />

              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Gostaria de receber atualizações, ofertas exclusivas e novidades sobre nossos serviços diretamente no seu e-mail."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Carregando..." : "Cadastrar"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  style={{ color: "blue", fontSize: 15 }}
                  to="/login"
                  variant="body2"
                >
                  Já tem uma conta? Faça o login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}