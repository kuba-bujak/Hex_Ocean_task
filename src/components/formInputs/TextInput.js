import './TextInput.css'

const TextInput = (props) => {
	const { label, name, type, error, onChange, id, icon, ...input} = props;
	return(
		<div className='form-group form-input'>
        <input
          type={type}
          id={id}
			    name={name}
          value={props.value}
          onChange={onChange}
          {...input}
        />
        <label htmlFor={id} className='form-label'>{label}</label>
        {error && <small className='error-input-message'>{error}</small>}
      </div>
	)
}

export default TextInput;