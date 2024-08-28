import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {useTypewriter} from "react-simple-typewriter"
import RecipeReviewCard from "../Card"
import { cpfMask } from "../Mask"
import CustomMarks from "../Sliders/index"
import "./homeComponent.css"
import { DataContext } from "../../contexts/DataContext"
import { toast } from "react-toastify"

//img
import usuarioCelular from "../../assets/user-celular.png"
import userOne from "../../assets/img1-user.png"
import userTwo from "../../assets/img2-user.png"
import userThree from "../../assets/img3-user.png"

function HomeComponent() {


    return (

        <>
            <StartHome />
            <RatherHome />
            <LoanHome />
        </>

    )

}


function StartHome() {

    const [documentId, setDocumentId] = useState("")

    const {setCpf} = useContext(DataContext)
    const navigate = useNavigate()

    const [text] = useTypewriter({

        words: ["Bank Center Conta Digital: 100% Gratuita"],
        loop: 1
    })

    function handleChange(e) {

        setDocumentId(cpfMask(e.target.value))

    }

    function handleCpf() {

        if(documentId.length < 14) {
    
            toast.error("CPF inválido")
            return
            
        }else {

            setCpf(documentId)
            navigate("/register")

        }

         

    }

    return (

        <div className="bg-principal">

        <section className="area-conteudo">

            <aside className="area-counteudo-img">


            <img src={usuarioCelular} alt="" />


            </aside>

            <aside className="area-counteudo-text">
                
                <div className="text">
                
                <strong>{text}</strong>
                


                    
                <div className="area-cpf">
                                          
                    <input
                    placeholder="DIGITE SEU CPF"
                    type="text"
                    maxLength="14"
                    name="documentId"
                    value={documentId}
                    onChange={handleChange}
                    

                    />
                    <button onClick={handleCpf}>CADASTRAR</button>

                </div>
                    

                </div>

            </aside>

        </section>

    </div>


    )

}

function RatherHome() {

    return (

        <div>

        <section className="clients">

            <h2>Avaliação dos nossos clientes ⭐️✨</h2>

            <article className="rather-clients">

                <aside>
                    <RecipeReviewCard 
                    name="Jorge"
                    width="100px"
                    description="Melhor banco que já usei! A conta é 100% gratuita e oferece todos os serviços que preciso sem nenhuma taxa escondida. Super recomendo!"
                    img={userOne} />

                </aside>

                <aside>
                <RecipeReviewCard 
                    name="Amanda"
                    width="50px"
                    description="Experiência incrível! Finalmente encontrei um banco que oferece uma conta totalmente gratuita, sem tarifas absurdas. Atendimento ao cliente de primeira!"
                    img={userTwo}
                    date={" 30 Julho 2024"}
                    />
                </aside>

                <aside>
                <RecipeReviewCard 
                    name="Lucas"
                    width="60px"
                    description="Excelente banco! Uso a conta gratuita há meses e nunca tive nenhum problema. Todos os serviços que preciso, sem pagar nada por isso. Recomendo de olhos fechados!"
                    img={userThree}
                    date={" 12 Maio 2024"}
                    />
                </aside>

            </article>

        </section>

    </div>


    )

}

function LoanHome() {

    return (

        <div>
            <section className="loan-clients">

                <h2>Simule Empréstimo Agora Mesmo</h2>
                
                <article className="loan-clients">

                    <CustomMarks />

                </article>
            </section>
        </div>

    )

}


export default HomeComponent
