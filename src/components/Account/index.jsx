import { useState ,useContext } from "react"
import {DataContext} from "../../contexts/DataContext"
import { auth } from "../../services/firebaseConnection"
import { signOut } from "firebase/auth"
import { cpfMask } from '../Mask';
import {doc, collection, query, where, getDocs, getDoc, updateDoc} from "firebase/firestore"
import { db } from "../../services/firebaseConnection";
import {FiSettings} from "react-icons/fi"
import Loading from "../Loading";

import "./accountComponent.css"
import { toast } from "react-toastify";
// import HeaderAccount from "../Header2"


//IMG

import imgPix from "../../assets/pix.png"
import imgBoleto from "../../assets/boleto.png"
import imgCelular from "../../assets/celular.png"

function AccountComponent() {


    const {user, setUser} = useContext(DataContext)
    

    return (

        <>
                {/* <HeaderAccount /> */}
                <MenuComponent name={user.name} saldo={user.saldo} user={user} setUser={setUser} />
        </>


    )

}


function MenuComponent(props) {


    const [input, setInput] = useState(false)
    const [title, setTitle] = useState("")
    const [value, setValue] = useState("")
    const [valueId, setValueId] = useState("")
    const [pix, setPix] = useState("")
    const [isDisabled, setIsDisable] = useState(false)
    const [transferencia, setTransferencia] = useState(false)
    const [activeInputValue, setActiveInputValue] = useState(false)
    const [valor, setValor] = useState(null)
    const [uidTransfer, setUidTransfer] = useState(null)
    


    async function deslogar() {

        await signOut(auth)

    }

    function handleInput(value) {

        

        if(value == 1) {
            
            setPix("")
            setInput(true)
            setTitle("TRANSFERIR")
            setValue("DIGITE A CHAVE PIX CPF")
            setValueId(value)

        }else if(value == 2) {

            setInput(true)
            setTitle("PAGAR")
            setValue("DIGITE O CODIGO DE BARRA")
            setValueId(value)


        }else if(value == 3 ) {

            setInput(true)
            setTitle("RECARREGAR")
            setValue("DIGITE O TELEFONE")
            setValueId(value)

        }

    }

    function handleTransferencia(e) {


        setPix(cpfMask(e.target.value))

        
    

    }

    async function handlePix() {


        if(transferencia) {

            if(valor == 0) {

                toast.error("Digite um Valor")

            }else {


                const conta = props.user.saldo - valor

                if(conta < 0) {

                    toast.error("Ops, Saldo Insuficiente")
                    return
                }

               
                await updateDoc(doc(db, "users", props.user.uid), {

                    saldo: conta

                }).then( async value => {

                    
                    await getDoc(doc(db, "users", uidTransfer))
                    .then( async userValue => {

                        var saldoUsuario = Number(userValue.data().saldo) + Number(valor)

                        await updateDoc(doc(db, "users", uidTransfer), {

                            
                            saldo: saldoUsuario


                        }).then(() => {

                            //Sucesso Agora Fazer Loading

                            toast.success("Transação feita com sucesso")

                             var data = {

                                ...props.user,
                                saldo: conta
    
                            }          
    
                            props.setUser(data)
                            handleCancel()
                            
                        



                        })


        
                    })



                    

                }).catch(err => {

                    console.log(err)

                })

            }

            return

        }

        if(props.user.cpf == pix) {

            toast.error("Você não pode transferir para você mesmo")
            return
        }

        const q = query(collection(db, "users"), where("cpf", "==", pix))

        await getDocs(q).then((value) => {

            if(value.empty) {

                toast.error("CHAVE CPF INVÁLIDA")
                return

            }


            value.forEach( user => {

                
                setIsDisable(true)
                setPix(`Nome: ${user.data().name}`)
                setActiveInputValue(true)
                setTitle("CONFIRMAR TRANSFERENCIA ?")
                setTransferencia(true)
                setUidTransfer(user.id)
                
                
                

            })
            

        }).catch(err => {

            console.log(err)

        })

    }

    function handleCancel() {

        setInput(false)
        setValueId(false)
        setTransferencia(false)
        setActiveInputValue(false)
        setPix("")
        setIsDisable(false)
        setTitle("")


    }

    return (

        <>

        <div className="account-container">

        <section className="account-conteudo">
            

            <h1>Olá, seja bem-vindo(a) {props.name}</h1>
            
            <div className="account-saldo">
                Seu Saldo: <strong>R$ {props.saldo}</strong>
            </div>

            <h2>O que você deseja fazer agora?</h2>

            <div className="area-btn">

                <div className="transfencia">

                    <img className="pix" src={imgPix}/>

                    <button onClick={() => handleInput(1)}>PIX</button>
                </div>

                
                <div className="transfencia">
                    <img className="boleto" src={imgBoleto}/>
                    <button onClick={() => handleInput(2)}>BOLETO</button>
                </div>

                
                <div className="transfencia">
                    <img className="recarga" src={imgCelular}/>
                    <button onClick={() => handleInput(3)}>RECARGA</button>
                </div>

            </div>

            <div className="area-input">


                {input && (

                <>
                
                {valueId == 2 || valueId == 3 ?
                 (

                 <> 

                 <input type="text" value={value} />   
                 <button onClick={() => toast.error("Em Manutenção")} style={{cursor: "not-allowed"}}>{title}</button>

                 </>

                ) :
                (
                <>
                    
                    <button onClick={handleCancel} className="cancel">X</button>
                    <input 
                        onChange={handleTransferencia}
                        placeholder={value}
                        value={pix} 
                        maxLength="14"
                        disabled={isDisabled}
                        
                        />


                    { activeInputValue && ( 
                    <> 
                    
                     <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" placeholder="R$ 10" style={{fontSize: 16}} />  
                     </>
                     )
                     }    
                        
                    <button className={transferencia ?  "transfer" : "" } onClick={handlePix}>{title}</button>             
                </>
                )
                
                }
                 

                </>


                )}
                
            
            </div>

            <button onClick={deslogar} className="account-logout">
                SAIR
            </button>

        </section>

    </div>       
        
        </>


    )

}

export default AccountComponent
