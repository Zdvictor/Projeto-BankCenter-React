//REACT
import { useState, useContext } from "react";

//DATA CONTEXT
import { DataContext } from "../../../contexts/DataContext";

//CPF MASK
import { cpfMask } from '../../Mask';

//FIREBASE
import {doc, collection, query, where, getDocs, getDoc, updateDoc, addDoc} from "firebase/firestore"
import { db } from "../../../services/firebaseConnection";

//LOADING
import {ClipLoader} from "react-spinners" 

//TOASTIFY
import { toast } from "react-toastify";

//IMG
import imgPix from "../../../assets/pix.png"



export default function Pix(props) {
    console.log(props)
    const [title, setTitle] = useState("CONFIRMAR")
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState("")
    const [valueId, setValueId] = useState("")
    const [isDisabled, setIsDisable] = useState(false)
    const [activeInputValue, setActiveInputValue] = useState(false)
    const [pix, setPix] = useState("")
    const [transferencia, setTransferencia] = useState(false)
    const [valor, setValor] = useState(0)
    const [uidTransfer, setUidTransfer] = useState(null)
    const {input, setInput} = useContext(DataContext)

    function handleInput(value) {

        

        if(value == 1) {
            
            setPix("")
            setInput(true)
            setTitle("CONTINUAR")
            setValue("DIGITE A CHAVE PIX CPF")
            setValueId(value)

        }

    }


    async function handlePix() {

        setLoading(true)

        if(transferencia) {

            if(valor == 0 || valor < 0) {

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


                        }).then(async () => {

                            addDoc(collection(db,"transactions"), {

                                userThatTransfer: props.user.uid,
                                userItReceived: uidTransfer,
                                value: valor,
                                date: new Date(),
                                

                            }).then(() => {

                                //Sucesso Agora Fazer Loading
                                setLoading(false)
                                toast.success("Transação feita com sucesso")

                                var data = {

                                    ...props.user,
                                    saldo: conta.toFixed(2)
        
                                }          
        
                                props.setUser(data)
                                handleCancel()
                            

                            })


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
            {!input && (
              <>
                <h2>O que você deseja fazer agora?</h2>

                <div className="area-btn">
                  <div className="transfencia">
                    <img className="pix" src={imgPix} />

                    <button onClick={() => handleInput(1)}>PIX</button>
                  </div>
                </div>
              </>
            )}


      {input && (
        <div className="area-input">
          <div style={{ display: "flex", justifyContent: "end" }}>
            <button onClick={handleCancel} className="close">
              X
            </button>
          </div>

          <p>PIX</p>

          <h5 className="transfer-h5">Saldo Atual: R$: {props.user.saldo}</h5>

          <label htmlFor="">
            {!isDisabled ? "Digite a Chave CPF:" : "Nome do Usuario:"}
          </label>
          <input
            disabled={isDisabled}
            value={pix}
            onChange={(e) => setPix(cpfMask(e.target.value))}
            type="text"
          />

          {activeInputValue && (
            <>
              <label htmlFor="">Informe o Valor:</label>
              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
              />
            </>
          )}

          {loading ? (
            <button>
              <ClipLoader color="#002fff" />
            </button>
          ) : (
            <button
              style={isDisabled ? { backgroundColor: "rgb(21, 255, 0)" } : {}}
              onClick={handlePix}
            >
              {title}
            </button>
          )}
        </div>
      )}
    </>
  );
}
