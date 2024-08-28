import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"


//PAGES
import Home from "../pages/Home"
import Cadastro from "../pages/Cadastro/index"
import Login from "../pages/Login"
import Account from "../pages/Account"
import Recovery from "../pages/Recovery"

//PAGE ERROR
import Error from "../pages/Error"


//Components
import Header from "../components/Header"

//Protection
import Private from "./private"

//Context
import DataProvider from "../contexts/DataContext"

//Toastfy
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';




function RoutesApp() {

    const location = useLocation()


    return (

        <>

        <DataProvider>

            {location.pathname !== "/account" && <Header />}

            <Routes>


                <Route path="/" element={ <Home /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/register" element={ <Cadastro /> } />
                <Route path="/recovery" element={ <Recovery />} />
                <Route path="/account" element={ <Private> <Account />  </Private> } />
                

                <Route path="*" element={ <Error /> } />

            </Routes>

        </DataProvider>

        
        </>
    )


}


export default function AppWrapper() {

    return (
    
        <BrowserRouter >

            <ToastContainer autoClose="3000" />
            <RoutesApp />
 
        
        </BrowserRouter>


    )


}




