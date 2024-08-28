import { useState, useEffect } from "react";
import { createContext } from "react";
import { auth, db } from "../services/firebaseConnection";
import {onAuthStateChanged} from "firebase/auth"
import {doc, collection, getDoc} from "firebase/firestore"

export const DataContext = createContext({})

    export default function DataProvider({children}) {

        const [cpf, setCpf] = useState("")
        const [logado, setLogado] = useState(false)
        const [loading, setLoading] = useState(true)
        const [user, setUser] = useState({})

        useEffect( () => {

                 async function autenticar() {

                  onAuthStateChanged(auth, (user) => {

                    if(user) {

                        setLogado(true)

                        async function inserirDados() {

                            var uid = user.uid

                            var docRef = doc(db, "users", uid)
                            await getDoc(docRef).then( (value) => {

                                setUser({
                                    
                                    uid: uid,
                                    name: value.data().name,
                                    cpf: value.data().cpf,
                                    email: value.data().email,
                                    saldo: value.data().saldo

                                })

                            }).catch(err => {

                                console.log(err)

                            })
    

                        }

                        inserirDados()





                    }else {

                        setLogado(false)
                        console.log("deslogado")

                    }

                    setLoading(false)


                })


            }

            autenticar()


        }, [])

        


        return (

            <DataContext.Provider value={{cpf, setCpf, logado, setLogado, loading, user, setUser}}>

                {children}

            </DataContext.Provider>

        )

}