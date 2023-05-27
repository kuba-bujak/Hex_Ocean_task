import React, { useState } from 'react';
import TextInput from './formInputs/TextInput';
import './DishForm.css'
import './formInputs/TextInput.css'

const DishForm = () => {
	const [statusMessage, setStatusMessage] = useState('');
	const [isStatusMessage, setIsStatusMessage] = useState(false);
	const [status, setStatus] = useState(false);
	const [dishValues, setDishValues] = useState({
		name: "",
		preparation_time: "",
		type: "",
		no_of_slices: "",
		diameter: "",
		spiciness_scale: "",
		slices_of_bread: ""
	})
  	const [errors, setErrors] = useState({});

	const showMessage = (status) => {
		if(status) {
			setStatusMessage('Order has been placed!')
			setDishValues({
				name: "",
				preparation_time: "",
				type: "",
				no_of_slices: "",
				diameter: "",
				spiciness_scale: "",
				slices_of_bread: ""
			})
		} else {
			setStatusMessage('Something went wrong! Check the data.')
		}
	}

  	const handleSubmit = async(event) => {
    	event.preventDefault();

   	// Validate the form data
		const validationErrors = validateFormData(dishValues);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const formData = {
			name: dishValues.name,
			preparation_time: dishValues.preparation_time,
			type: dishValues.type
		}

		if (dishValues.type === 'pizza') {
			formData.no_of_slices = dishValues.no_of_slices;
			formData.diameter = dishValues.diameter;
		 } else if (dishValues.type === 'soup') {
			formData.spiciness_scale = dishValues.spiciness_scale;
		 } else if (dishValues.type === 'sandwich') {
			formData.slices_of_bread = dishValues.slices_of_bread;
		 }

		// Make the POST request to the API endpoint
		await fetch('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
			.then((response) => {
				showMessage(response.ok);
				setIsStatusMessage(true);
				setStatus(response.ok)
			})
			// .then((data) => {
			// console.log(data);
			// // Handle the response from the API
			// })
			.catch((error) => {
			console.error(error);
			// Handle any error that occurred during the request
			});
  };

	const validateFormData = (dishValues) => {
		const errors = {};

		if (!dishValues.name) {
			errors.name = 'Name is required';
		}

		if (!dishValues.preparation_time) {
			errors.preparation_time = 'Preparation time is required';
		} else if (!/^([0-9]{2}:){2}[0-9]{2}$/.test(dishValues.preparation_time)) {
			errors.preparation_time = 'Invalid preparation time format (HH:MM:SS)';
		}

		if (!dishValues.type) {
			errors.type = 'Type is required';
		} else if (dishValues.type === 'pizza') {
			if (!dishValues.no_of_slices) {
			errors.no_of_slices = 'Number of slices is required';
			}
			if (!dishValues.diameter) {
			errors.diameter = 'Diameter is required';
			}
		} else if (dishValues.type === 'soup') {
			if (!dishValues.spiciness_scale) {
			errors.spiciness_scale = 'Spiciness scale is required';
			}
		} else if (dishValues.type === 'sandwich') {
			if (!dishValues.slices_of_bread) {
			errors.slices_of_bread = 'Number of slices of bread is required';
			}
		}

		return errors;
	};

	const textInputs = [
		{
			 id: "name",
			 name: "name",
			 type: "text",
			 label: "Dish Name",
			 icon: "fa fa-user",
			 required: true,
			 error: errors.name
		},
		{
			id: "preparation_time",
			name: "preparation_time",
			type: "text",
			label: "Preparation Time",
			icon: "fa fa-user",
			required: true,
			error: errors.preparation_time
	  },
	]

	const pizzaInputs = [
		{
			id: "no_of_slices",
			name: "no_of_slices",
			type: "number",
			label: "Number of Slices",
			min:"1",
			icon: "fa fa-user",
			required: true,
			error: errors.no_of_slices
	  },
	  {
			id: "diameter",
			name: "diameter",
			type: "number",
			label: "Diameter",
			min:"1",
			step: 0.1,
			icon: "fa fa-user",
			required: true,
			error: errors.diameter
  		},
	]

	const soupInputs = [
		{
			id: "spiciness_scale",
			name: "spiciness_scale",
			type: "number",
			label: "Spiciness Scale",
			icon: "fa fa-user",
			min:"1",
			max:"10",
			required: true,
			error: errors.spiciness_scale
	  }
	]

	const sandwichInputs = [
		{
			id: "slices_of_bread",
			name: "slices_of_bread",
			type: "number",
			label: "Slices of Bread",
			min:"1",
			icon: "fa fa-user",
			required: true,
			error: errors.slices_of_bread
	  }
	]

	const onChange = (event) => {
		setDishValues({ ...dishValues, [event.target.name]: event.target.value });
  }

  return (
	<div className='dishForm-container'>
		{isStatusMessage && 
		<>
			{status 
			?
			<div className='message-container correct-message'>
				<h3 className='message-text'>{statusMessage}</h3>
			</div>
			:
			<div className='message-container error-message'>
				<h3 className='message-text'>{statusMessage}</h3>
			</div>
		}
		</>}
		
		<div className='dishForm-image'></div>
		<form onSubmit={handleSubmit} className='dishForm-form' noValidate>

		<h2 className='form-header'>Choose your preferable meal!</h2>

		{textInputs.map(input => (
			<TextInput 
				key={input.id}
				{...input}
				value={dishValues[input.name]}
				onChange={onChange}/>
		))}

		<div className='form-group'>
			<div className='select-list form-input'>
				<select id="type" name="type" onChange={onChange} required>
					<option value="">Select type</option>
					<option value="pizza">Pizza</option>
					<option value="soup">Soup</option>
					<option value="sandwich">Sandwich</option>
				</select>
			</div>
		
		{errors.type && <small className='error-input-message'>{errors.type}</small>}
		</div>

		{dishValues.type === 'pizza' && pizzaInputs.map((input) => (
			<TextInput
				key={input.id}
				{...input}
				value={dishValues[input.name]}
				onChange={onChange}
				error={errors[input.name]}
			/>
		))}
		{dishValues.type === 'soup' && soupInputs.map((input) => (
			<TextInput
				key={input.id}
				{...input}
				value={dishValues[input.name]}
				onChange={onChange}
				error={errors[input.name]}
			/>
		))}
		{dishValues.type === 'sandwich' && sandwichInputs.map((input) => (
			<TextInput
				key={input.id}
				{...input}
				value={dishValues[input.name]}
				onChange={onChange}
				error={errors[input.name]}
			/>
		))}
		<div>
		<input type="submit" value="Submit" className='submit'/>
		</div>
		</form>
	</div>
  );
};

export default DishForm;
