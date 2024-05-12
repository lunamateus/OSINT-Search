import './App.css'
import { useState } from 'react';
import { Navbar } from './components/Navbar'
import { InputField } from './components/InputField'
import { Footer } from './components/Footer'
import inputFieldsData from './data/inputFieldsData.json';
import sourcesData from './data/sourcesData.json';

function App() {
  const [inputValues, setInputValues] = useState({}); // Object to store input values

  const handleSearchClick = () => {
    console.log('Input values:', inputValues); // TO DO
  };

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
                onChange={(value) => setInputValues({ ...inputValues, [field.id]: value })}
                data={sourcesData}
              />
            ))}
            <div className="mt-3 text-center">
              <button className="btn btn-dark" id="search-button" onClick={handleSearchClick}>Pesquisar</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
