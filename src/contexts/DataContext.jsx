import { useState, useEffect } from "react";
import { createContext } from "react";
import { auth, db } from "../services/firebaseConnection";
import {onAuthStateChanged} from "firebase/auth"
import {doc, collection, getDoc, onSnapshot} from "firebase/firestore"

export const DataContext = createContext({})

    export default function DataProvider({children}) {

        const [cpf, setCpf] = useState("")
        const [logado, setLogado] = useState(false)
        const [loading, setLoading] = useState(true)
        const [user, setUser] = useState({})
        const [input, setInput] = useState(false)

        useEffect( () => {

                 async function autenticar() {

                  onAuthStateChanged(auth, (user) => {

                    if(user) {

                        setLogado(true)

                        async function inserirDados() {

                            var uid = user.uid

                            var docRef = doc(db, "users", uid)
                            const unsub = onSnapshot(docRef, (queryrSnapshot) => {

                            
                                setUser({
                                    
                                    uid: uid,
                                    name: queryrSnapshot.data().name,
                                    cpf: queryrSnapshot.data().cpf,
                                    email: queryrSnapshot.data().email,
                                    saldo: queryrSnapshot.data().saldo.toFixed(2)

                                })

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

            <DataContext.Provider value={{cpf, setCpf, logado, setLogado, loading, user, setUser, input, setInput}}>

                {children}

            </DataContext.Provider>

        )

}