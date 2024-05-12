/* eslint-disable react/prop-types */
import { Form } from 'react-bootstrap';

function CheckboxGroup({ allChecked, onToggleAll, data, checked, onChange, label }) {
  return (
    <div>
      <Form.Check checked={allChecked} onChange={onToggleAll} label={label || 'Todos'} />
      {data && (
        <Form.Check checked={checked} onChange={onChange} label={data.fullName} />
      )}
    </div>
  );
}

export default CheckboxGroup;
