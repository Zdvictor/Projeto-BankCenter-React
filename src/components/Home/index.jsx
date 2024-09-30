//REACT
import { useState, useContext , useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"

//TYPEWRITER
import {useTypewriter} from "react-simple-typewriter"

//MATERIAL UI COMPONENTS
import RecipeReviewCard from "../Card"
import CustomMarks from "../Sliders/index"

//CPF MASK
import { cpfMask } from "../Mask"

//DATA CONTEXT
import { DataContext } from "../../contexts/DataContext"

//TOASTIFY
import { toast } from "react-toastify"

//CSS
import "./homeComponent.css"

//IMG
import usuarioCelular from "../../assets/user-celular.png"
import userOne from "../../assets/img1-user.png"
import userTwo from "../../assets/img2-user.png"
import userThree from "../../assets/img3-user.png"
import Card from "../../assets/card.png"
import Suport from "../../assets/suporte.png"
import Pix from "../../assets/pix.png"


function HomeComponent() {


    return (

        <>
            <StartHome />
            <RatherHome />
            <LoanHome />
            <BenefitsHome />

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

function BenefitsHome() {

    const [showAnimation, setShowAnimation] = useState(false)
    const animation = useRef()

    useEffect(() => {

        function Observable() {

            var observable = new IntersectionObserver( obs => {


                if(obs[0].isIntersecting) {

                    setShowAnimation(true)

                }else {

                    setShowAnimation(false)

                }


            })


            var ref = animation.current

            observable.observe(ref)




        }


        Observable()

    } ,[])

    return (

        <div>
            <section className="benefits ">

                <h2>Melhores Benefícios</h2>
                
                <article ref={animation} className={showAnimation ? "benefits animationBenefits" : "benefits" }>

                    <div className="benefits-box ">
                        <img src={Card} />

                        <p>
                         Abra sua conta agora e tenha um cartão cheio de benefícios exclusivos,
                         com zero anuidade! Aproveite todas as vantagens sem custo e com a praticidade que você merece.
                        </p>
                    </div>

                    <div className="benefits-box">
                        <img src={Suport} />

                        <p>
                        Contamos com uma equipe dedicada e pronta para oferecer o melhor atendimento sempre que você precisar.
                         Nosso suporte é ágil, eficiente e focado em resolver suas dúvidas e problemas da maneira mais rápida possível.
                        </p>
                    </div>

                    <div className="benefits-box">
                        <img src={Pix} />

                        <p>
                        Pix com transferências ilimitadas, a qualquer momento e sem complicações
                        Agilidade e praticidade para enviar e receber dinheiro 24 horas por dia, todos os dias da semana!
                        </p>
                    </div>
                
                </article>
            </section>
            
        </div>

    )

}



export default HomeComponent
