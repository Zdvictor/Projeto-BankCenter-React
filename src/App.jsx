import RoutesApp from "./routes"
import "./App.css"
import CookieConsent from "react-cookie-consent"

function App() {

    return (

      <div className="container">

            <CookieConsent buttonText="Eu entendo">Este site utiliza cookies para melhorar a experiência do usuário.</CookieConsent>

            <RoutesApp />

        
  

      </div>
      

    )

}


export default App