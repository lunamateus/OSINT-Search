import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src="/icon-24px.png" alt="Logo" className="d-inline-block align-text-top" />
          OSINT Search
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink exact="true" className="nav-link" to="/">Início</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">Sobre</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contato</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
