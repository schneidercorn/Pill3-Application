import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import * as userService from '../index';
import { userStatus } from '../ducks/userReducers';
import { styles } from '../styles';

export const Register = ({ navigation }) => {
	const { container, form, header } = styles;
	const [error, setError] = useState('');
	const [serial, setSerial] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const dispatch = useDispatch();

	function validateSerial(serial) {
		// serial number contains exactly 9 alphanumerics
		if (serial.length != 9) {
			setError('Please enter a valid serial number');

			return false;
		}

		return true;
	}

	function validateEmail(email) {
		// This is just a regex for email validation
		// eslint-disable-next-line max-len
		const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		// email not formatted correctly
		if (!emailValidation.test(email)) {
			setError('Please enter a valid email');

			return false;
		}

		return true;
	}

	async function registerSubmit(serial, name, email) {
		if (!validateSerial(serial) && !validateEmail(email))
			return;

		return await userService.createUser({ serial, name, email })
			.then(() => dispatch(userStatus(serial)))
			.catch(error => console.log('ERROR REGISTERING: ' + error));
	}

	return (
		<View style = { container }>
			<View style = { form }>
				<Text> { error } </Text>
				<Input
					label = 'serial'
					onChangeText = { serial => setSerial(serial) }
				/>
				<Input
					label = 'name'
					onChangeText = { name => setName(name) }
				/>
				<Input
					label = 'email'
					onChangeText = { email => setEmail(email) }
				/>
				<Button
					title = 'REGISTER'
					onPress = { () => registerSubmit(serial, name, email) }
				/>
				<Text>
					{ 'Already have an Account? ' }
					<Text
						style = {{ color: 'rgba(78, 116, 289, 1)' }}
						onPress = { () => navigation.navigate('Login') }
					>
					Log in here
					</Text>
				</Text>
			</View>
		</View>
	);
};