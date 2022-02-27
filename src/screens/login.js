import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as userService from '../index';

export const Login = ({ navigation }) => {
	const [error, setError] = useState('');
	const [serial, setSerial] = useState('');

	function serialExists(serial) {
		return userService.serialExists(serial);
	}

	return (
		<View>
			<Text> { error } </Text>
			<Input
				onChangeText = { serial => setSerial(serial) }
			/>
			<Button
				title = 'LOGIN'
				onPress = { async () => {
					if (await serialExists(serial))
						setError('Logging in as ' + serial + '...');
					else
						setError('Login Failed.');
				} }
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