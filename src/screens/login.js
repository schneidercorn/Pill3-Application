import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import * as userService from '../index';
import { userStatus } from '../stores/userReducers';

export const Login = ({ navigation }) => {
	const [error, setError] = useState('');
	const [serial, setSerial] = useState('');
	const dispatch = useDispatch();

	async function loginSubmit(serial) {
		return await userService
			.serialExists(serial)
			.then(loginSuccess => {
				console.log(loginSuccess.isLoggedIn);
				if (loginSuccess.isLoggedIn == true)
					dispatch(userStatus(serial));

				setError(loginSuccess.isLoggedIn ? 'true' : 'false');
			})
			.catch(error => console.log('ERROR LOGGING IN: ' + error));
	}

	return (
		<View>
			<Text> { error } </Text>
			<Input
				onChangeText = { serial => setSerial(serial) }
			/>
			<Button
				title = 'LOGIN'
				onPress = { () => loginSubmit(serial) }
			/>
			<Text>
				{ 'Don\'t have an account? ' }
				<Text
					onPress = { () => navigation.navigate('Register') }
				>
					Register here
				</Text>
			</Text>
		</View>
	);
};