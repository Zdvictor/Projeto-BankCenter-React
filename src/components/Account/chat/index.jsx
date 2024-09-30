import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../contexts/DataContext";
import { RiRobot2Fill } from "react-icons/ri";
import { BiSolidBot } from "react-icons/bi";
import { toast } from "react-toastify";
import {collection, query, where, getDocs, getDoc, doc, orderBy} from "firebase/firestore"
import { db } from "../../../services/firebaseConnection";

import {ThreeDot} from "react-loading-indicators"


export default function Chat (props) {

    const [showChat, setShowChat] = useState(false)
    const [showSecondClose, setShowSecondClose] = useState(false)
    const [msg, setMsg ] = useState([])
    const [inputUserMsg,setInputUserMsg] = useState("")
    const [showLoadingResponse, setShowLoadingResponse] = useState(false)
    const {setInput} = useContext(DataContext)

    useEffect(() => {

        function monitoring() {

            window.addEventListener("resize", setSecondeClose)

        }

        monitoring()

    }, [])

    function setSecondeClose(e) {

        if(e.target.innerWidth <= 1700) {

            setShowSecondClose(true)

        }else {

            setShowSecondClose(false)

        }
    }

    function sendMsg() {

      if (inputUserMsg === '') {
          toast.error("Digite um Numero");
          return;
      }

      setShowLoadingResponse(true)
  
      const msgUser = inputUserMsg;
  
      const pushMsg = [
          ...msg,
          {
              id: Date.now(),
              role: 0,
              msg: msgUser
          }
      ];
  
      setMsg(pushMsg);
      setInputUserMsg("");

      if(msgUser === "0") {

        setMsg([])
        setShowLoadingResponse(false)
        return

      }
  
      else if (msgUser === "1") {

        setTimeout(() => {
          async function findTransactions() {
              const q = query(
                  collection(db, "transactions"),
                  where("userThatTransfer", "==", props.user.uid),
                  orderBy("date", "desc")
              );
  
              try {
                  const snapshot = await getDocs(q);
  
                  if (snapshot.empty) {

                      const botResponse = {
                          id: Date.now(),
                          role: 1,
                          msg: `Seu extrato está vazio. Realize uma transação e volte aqui para ver as atualizações.`,
                      };
                      setMsg((prevState) => [...prevState, botResponse]);
                      setShowLoadingResponse(false)
                      return;
                  }
  
                  const promises = [];
  
                  snapshot.forEach((user) => {
                      const userDoc = user.data();
                      const date = userDoc.date.toDate();
                      const value = userDoc.value;
  
                      const options = {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                      };
  
                      const formattedDate = date.toLocaleString('pt-BR', options);
  
                      // Criar uma nova promise para cada iteração
                      const promise = Promise.all([
                          getDoc(doc(db, "users", userDoc.userThatTransfer)),
                          getDoc(doc(db, "users", userDoc.userItReceived)),
                      ]).then(([transferUserDoc, receivedUserDoc]) => {
                          const userThatTransfer = transferUserDoc.data().name;
                          const userItReceived = receivedUserDoc.data().name;
  
                          const botResponse = {
                              id: Date.now(),
                              role: 1,
                              msg: `Transferencia PIX \n
                                    Pagador: ${userThatTransfer} \n
                                    Recebedor: ${userItReceived} \n
                                    data: ${formattedDate} \n
                                    valor: R$ ${value}`,
                          };
  
                          // Atualiza o estado com a resposta do bot
                          setMsg((prevState) => [...prevState, botResponse]);
                      });
  
                      promises.push(promise);
                  });
  
                  
                  await Promise.all(promises);
  
                  
                  const botFinish = {
                      id: Date.now(),
                      role: 1,
                      msg: `Deseja Algo a Mais? Volte Para o Menu Digite 0`,
                  };
  
                  setMsg((prevState) => [...prevState, botFinish]);
                  setShowLoadingResponse(false)

              } catch (err) {
                  console.log(err);
                  setShowLoadingResponse(false)
              }
          }
  
          findTransactions();

        }, 1200)
  
      } else if (msgUser === "2") {
        setTimeout(() => {
          const botResponse = {
              id: Date.now(),
              role: 1,
              msg: "Você podera solicitar um empréstimo em breve."
          };
          setMsg((prevState) => [...prevState, botResponse]);

          setTimeout(() => {
          const botFinish = {
            id: Date.now(),
            role: 1,
            msg: `Deseja Algo a Mais? Volte Para o Menu Digite 0`,
        };

        setMsg((prevState) => [...prevState, botFinish])

    }, 500)

          setShowLoadingResponse(false)

        }, 2000)
  
      }  else {
        
        setTimeout(() => {
          const botResponse = {
              id: Date.now(),
              role: 1,
              msg: "Desculpe, não entendi sua solicitação. Por favor, escolha uma das opções: 1 ou 2."
          };
          setMsg((prevState) => [...prevState, botResponse]);

          setShowLoadingResponse(false)

        }, 1200)
          
      }

      
  }
  

    return (

        <section className="area-bot">
        {showChat && 
        <div className="chat"> 
            
            {showSecondClose && <button onClick={() => setShowChat(!showChat)} className="second-close">X</button>}

          <div className="msg-bot">
          <RiRobot2Fill />
            <p>

              Olá, tudo bem? Eu sou a IA do Bank Center e vou te orientar!
              Veja os tópicos disponíveis abaixo: <br /> <br />
               1. Extrato <br />
               2. Empréstimos <br />

            </p>
          </div>    

            {
              msg.map((msg) => (

                <div key={msg.id} className={msg.role == 0 ? "msg-user" : "response-bot"}>
                  {msg.role == 1 && <RiRobot2Fill />}
                  <p>{msg.msg}</p>
                </div>

              ))
            }

            { showLoadingResponse &&

            <div className="response-bot">
            <RiRobot2Fill /> 
            <i style={{marginLeft: 30}}><ThreeDot color="#1a281a" size="small" text="" textColor="" /></i>
            </div>

            } 





        <input onChange={(e) => setInputUserMsg(e.target.value)} value={inputUserMsg} placeholder="Digite Sua Mensagem" className="input-chat" type="text" />
        <button onClick={sendMsg} value={inputUserMsg} className="send-msg">ENVIAR</button>

        </div>

}

        <BiSolidBot onClick={() =>  {setShowChat(!showChat), setInput(false) }} color="#fff" size={50} />
        
      </section>

    )

}