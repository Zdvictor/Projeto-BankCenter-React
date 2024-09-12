import { useState ,useContext } from "react"
import {DataContext} from "../../contexts/DataContext"
import { auth } from "../../services/firebaseConnection"
import { signOut } from "firebase/auth"
import { cpfMask } from '../Mask';
import {doc, collection, query, where, getDocs, getDoc, updateDoc} from "firebase/firestore"
import { db } from "../../services/firebaseConnection";
import {FiSettings} from "react-icons/fi"
import Loading from "../Loading";
import {ClipLoader} from "react-spinners" 

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
    const [title, setTitle] = useState("CONFIRMAR")
    const [loading, setLoading] = useState(false)
    const [cpf,setCpf] = useState("")
    const [value, setValue] = useState("")
    const [valueId, setValueId] = useState("")
    const [pix, setPix] = useState("")
    const [isDisabled, setIsDisable] = useState(false)
    const [transferencia, setTransferencia] = useState(false)
    const [activeInputValue, setActiveInputValue] = useState(false)
    const [valor, setValor] = useState(0)
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


    async function handlePix() {

        setLoading(true)

        if(transferencia) {

            if(valor == 0) {

                toast.error("Digite um Valor")
                setLoading(false)
            

            }else {

                setLoading(true)
                const conta = props.user.saldo - valor

                if(conta < 0) {

                    toast.error("Ops, Saldo Insuficiente")
                    setLoading(false)
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
                            setLoading(false)
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
                    setLoading(false)
                    console.log(err)

                })

            }

            return

        }

        if(props.user.cpf == pix) {

            toast.error("Você não pode transferir para você mesmo")
            setLoading(false)
            return
        }

        const q = query(collection(db, "users"), where("cpf", "==", pix))

        await getDocs(q).then((value) => {

            if(value.empty) {

                toast.error("CHAVE CPF INVÁLIDA")
                setLoading(false)
                return

            }


            value.forEach( user => {

                setLoading(false)
                setIsDisable(true)
                setPix(`${user.data().name.toUpperCase()}`)
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
        setLoading(false)
        setValor(0)


    }

    return (

        <>

        <div className="account-container">

            <div className="area-logout">

                <button onClick={deslogar} className="account-logout">
                    SAIR
                </button>

            </div>

        

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

            </div>

            {input && (

                <div className="area-input">

                <div style={{display: "flex", justifyContent: "end"}}>
                    <button onClick={handleCancel} className="close">X</button>
                </div>


                <p>PIX</p>

                <h5 className="transfer-h5">Saldo Atual: R$: {props.saldo}</h5>

                <label htmlFor="">{!isDisabled ? "Digite a Chave CPF:" : "Nome do Usuario:"}</label>
                <input disabled={isDisabled} value={pix} onChange={(e) => setPix(cpfMask(e.target.value))} type="text" />

                {activeInputValue && (
                    <>
                    <label htmlFor="">Informe o Valor:</label>
                    <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" />
                    </>
                )}

                {loading ?

                <button><ClipLoader color="#002fff" /></button>
                :
                <button style={isDisabled ? { backgroundColor: "rgb(21, 255, 0)" } : {}} onClick={handlePix}>{title}</button>
                }
                


                </div>


            )}


        </section>

    </div>       
        
        </>


    )

}

export default AccountComponent
