import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../contexts/DataContext";


function Private({children}) {

    
    const {logado, loading} = useContext(DataContext)

    if(loading) {

        return (

            <div></div>

        )

    }


    if(logado) {

        return children

    }

    return <Navigate to="/" />

}


export default Private