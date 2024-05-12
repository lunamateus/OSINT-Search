import {useState} from 'react';
import PropTypes from 'prop-types';
import Input from './Input'; // Import the Input component
import CheckboxGroup from './CheckboxGroup'; // Import the CheckboxGroup component
import OffcanvasFilters from './OffcanvasFilters'; // Import the OffcanvasFilters component

export function InputField({ id, name, placeholder, feedbackMessage, data }) {
  const [inputText, setInputText] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => {
    const initialCheckedState = data ? Object.keys(data).reduce((acc, item) => ({ ...acc, [item]: true }), {}) : {}; // Initialize based on data
    return initialCheckedState;
  });

  const getCheckedItems = data ? Object.keys(data).filter((source) => data[source].info.includes(id)) : []; // Handle potential absence of data

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleToggleTodosCheckbox = () => {
    const allChecked = Object.values(checkedItems).every(Boolean);
    const updatedCheckedItems = Object.assign({}, ...Object.keys(checkedItems).map((item) => ({ [item]: !allChecked }))); // Toggle all checkboxes
    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckboxChange = (event, item) => {
    const updatedCheckedItems = { ...checkedItems, [item]: event.target.checked };
    setCheckedItems(updatedCheckedItems);
  };

  return (
    <>
      {name && <label className="mt-3" htmlFor={`input-${id}`}>{name}</label>}
      <Input
        id={`input-${id}`}
        name={`input-${id}`}
        placeholder={placeholder}
        value={inputText}
        onChange={handleInputChange}
        onShowOffcanvas={handleShowOffcanvas}
      />
      <OffcanvasFilters show={showOffcanvas} onHide={handleCloseOffcanvas} title={`Filtros para ${name}`}>
        {data && (
          <>
            <CheckboxGroup allChecked={getCheckedItems.length === data.length} onToggleAll={handleToggleTodosCheckbox} data={data} />
            <div className="d-flex flex-wrap"> {/* Wrap checkboxes in a flex container */}
              {getCheckedItems.map((item, index) => (
                <CheckboxGroup
                  key={index}
                  checked={getCheckedItems.includes(item)}
                  data={data[item]}
                  onChange={handleCheckboxChange}
                  label={`Todo: ${data[item].fullName}`}
                  className="me-2 mb-2" // Add margin for spacing
                />
              ))}
            </div>
          </>
        )}
      </OffcanvasFilters>
      <div id={`validation${id}Feedback`} className="invalid-feedback">
        {feedbackMessage}
      </div>
    </>
  );
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  feedbackMessage: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  data: PropTypes.object, // Allow optional data prop
};

export default InputField;
