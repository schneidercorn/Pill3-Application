import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import * as userService from '../index';
import { userStatus } from '../ducks/userReducers';
import { styles } from '../styles';
import Logo from '../assets/logo.png';

export const Login = ({ navigation }) => {
	const { container, form, extendedScrollView } = styles;
	const [error, setError] = useState('');
	const [serial, setSerial] = useState('');
	const dispatch = useDispatch();

	async function loginSubmit(serial) {
		return await userService.loginUser(serial)
			.then(loginSuccess => {
				if (loginSuccess.isLoggedIn == true)
					dispatch(userStatus(serial));

				setError(loginSuccess.isLoggedIn ? null : 'Please enter a valid Serial');
			})
			.catch(error => console.log('ERROR LOGGING IN: ' + error));
	}

	const logoContainerStyle = {
		width: '100%',
		height: '35%',
		backgroundColor: 'white',
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		justifyContent: 'center',
		zIndex: 10,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5
	};
	const logoStyle = {
		height: '50%',
		resizeMode: 'center',
		alignSelf: 'center'
	};

	return (
		<View style = { container }>
			<View style = { logoContainerStyle }>
				<Image source = { Logo } style = { logoStyle } />
			</View>
			<View style = { [form, { backgroundColor: 'rgba(245, 245, 255, 1)' } ] }>
				<Input
					label = 'serial'
					onChangeText = { serial => setSerial(serial) }
					errorMessage = { error }
				/>
				<Button
					title = 'LOGIN'
					onPress = { () => loginSubmit(serial) }
				/>
				<Text>
					{ 'Don\'t have an account? ' }
					<Text style = {{ color: 'rgba(78, 116, 289, 1)' }} onPress = { () => navigation.navigate('Register') } >
						Register here
					</Text>
				</Text>
			</View>
			<View style = {{ height: 100 }} />
		</View>
	);
};