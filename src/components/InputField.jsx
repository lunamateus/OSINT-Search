import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, FormControl, InputGroup, Offcanvas } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import data from '../data/sourcesData.json';

function FilterIcon() {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-filter"
    viewBox="0 0 16 16"
  >
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
  )
}

export function InputField({ id, name, placeholder, feedbackMessage }) {
  const items = Object.keys(data).filter((source) => data[source].info.includes(id));

  const [checkedItems, setCheckedItems] = useState(() => {
    const initialCheckedState = { Todos: true };
    items.forEach((item) => {
      initialCheckedState[item] = true;
    });
    return initialCheckedState;
  });

  const handleCheckboxChange = (event, item) => {
    const updatedCheckedItems = { ...checkedItems, [item]: event.target.checked };
    setCheckedItems(updatedCheckedItems);
  };

  const handleToggleTodosCheckbox = () => {
    const allChecked = Object.values(checkedItems).every(Boolean);
    const updatedCheckedItems = { ...checkedItems };
    Object.keys(updatedCheckedItems).forEach((item) => {
      updatedCheckedItems[item] = !allChecked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const allChecked = Object.values(checkedItems).every(Boolean);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <>
      {name && (
        <label className="mt-3" htmlFor={`input-${id}`}>{name}</label>
      )}

      <InputGroup className="has-validation">
        <FormControl
          type="text"
          id={`input-${id}`}
          name={`input-${id}`}
          data-text={id}
          placeholder={placeholder}
          aria-describedby={`validation${id}Feedback`}
          autoComplete="on"
        />
        <Button variant="outline-dark" onClick={handleShowOffcanvas}>
          <FilterIcon></FilterIcon>
        </Button>
        <Collapse in={showOffcanvas}>
          <div id={`validation${id}Feedback`} className="invalid-feedback">
            {feedbackMessage}
          </div>
        </Collapse>
      </InputGroup>

      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><FilterIcon></FilterIcon> Filtros para {name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <strong>
              <Form.Check checked={allChecked} onChange={handleToggleTodosCheckbox} label=" Todos"></Form.Check>
            </strong>
          </div>
          {items.map((item, index) => (
            <div key={index}>
              <Form.Check checked={checkedItems[item]} onChange={(e) => handleCheckboxChange(e, item)} label={data[item].fullName}></Form.Check>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  feedbackMessage: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default InputField;
