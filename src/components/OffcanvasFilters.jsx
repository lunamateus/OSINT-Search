/* eslint-disable react/prop-types */
import { Offcanvas } from 'react-bootstrap';

function OffcanvasFilters({ show, onHide, title, children }) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{children}</Offcanvas.Body>
    </Offcanvas>
  );
}

export default OffcanvasFilters;
