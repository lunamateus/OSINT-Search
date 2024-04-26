import './App.css'
import { Navbar } from './components/Navbar'
import { InputField } from './components/InputField'
import { Footer } from './components/Footer'
import inputFieldsData from './data/inputFieldsData.json';

function App() {

  return (
    <>
     <Navbar />
      <div className="container">
        <div className="row py-5 justify-content-md-center">
          <div className="col col-md-6" id="search-form">
            <div className="text-center">
              <img src="/icon-512px.png" alt="Logo"/>
              <h2>Pesquisa OSINT</h2>
            </div>
            {inputFieldsData.map((field, index) => (
              <InputField
                key={index}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                feedbackMessage={field.feedbackMessage}
              />
            ))}
            <div className="mt-3 text-center">
              <button className="btn btn-dark" id="search-button">Pesquisar</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
