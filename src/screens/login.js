import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as userService from '../index';

export const Login = () => {
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
		</View>
	);
};