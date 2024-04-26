import { NavLink } from 'react-router-dom';

export function Footer() {
  return (  
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p className="col-md-4 mb-0 text-muted">© <span id="currentYear"></span> OSINT Search</p>
        <NavLink to="/" className="col-md-4 d-flex align-items-center justify-content-center">
          <img id="logoFooter" src="/icon-24px.png" alt="Logo" />
        </NavLink>
        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <NavLink exact="true" to="/" className="nav-link px-2 text-muted">Início</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link px-2 text-muted">Sobre</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link px-2 text-muted">Contato</NavLink>
          </li>
        </ul>
      </footer>
    </div>
  );
}
