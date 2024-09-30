//REACT
import { useState ,useContext } from "react"

//DATA CONTEXT
import {DataContext} from "../../contexts/DataContext"

//FIREBASE
import { auth } from "../../services/firebaseConnection"
import { signOut } from "firebase/auth"

//REACT ICONS
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";

//IMG
import Pix from "./pix"

//CHAT
import "./accountComponent.css"

//COMPONENT CHAT
import Chat from "./chat"


function AccountComponent() {


    const {user, setUser} = useContext(DataContext)

    const [hidenSaldo, setHidenSaldo] = useState(false)
    

    async function deslogar() {

        await signOut(auth)

    }
    
    

    return (

        <>

        <div className="account-container">
          
          <Chat user={user} />

          <div className="area-logout">
            <button onClick={deslogar} className="account-logout">
              SAIR
            </button>
          </div>

          <section className="account-conteudo">
            <h1>Olá, seja bem-vindo(a) {user.name}</h1>

            <div className="account-saldo">
              <i
                onClick={() => setHidenSaldo(!hidenSaldo)}
                className="icon-eyes"
              >
                {!hidenSaldo ? <FaEyeSlash /> : <BiSolidShow />}
              </i>
              Seu Saldo:{" "}
              <strong>R$ {hidenSaldo ? "*****" : user.saldo} </strong>
            </div>

          <Pix user={user} setUser={setUser} />

          </section>
        </div>

        </>


    )

}


export default AccountComponent
