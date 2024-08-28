import { Link } from "react-router-dom"
import "./header.css"


function Header() {

    return (

        <div>

            <header>
                
                <h2>Bank Center</h2>

                <ul>
                    <li>
                        <Link to="/" >Home</Link>
                    </li>

                    <li>
                        <Link to="/login" >Logar</Link>
                    </li>

                    <li>
                        <Link to="/register" >Cadastrar</Link>
                    </li>


                </ul>

            </header>

        </div>

    )

}


export default Header