import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import { useEffect } from 'react';
import * as reduxServices from '../ducks/userReducers';
import { useState } from 'react';
import { Button } from 'react-native-elements';
import * as userService from '../services/user';
import { Navbar } from '../components/navbar';
import { styles } from '../styles';
import { LinearGradient } from 'react-native-svg';

export const Info = ({ navigation }) => {
	const { container, form, center, rowAlign } = styles;
	const { serial } = useSelector(state => state.user);
	const [ user, setUser ] = useState('');
	const [ isLoaded, setLoaded ] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchData() {
			dispatch(reduxServices.loadUser());
			setUser(await getUserInfo(serial));
			setLoaded(true);
		}

		fetchData();
		const willFocusSubscription = navigation.addListener('focus', () => {
			fetchData();
		});

		return willFocusSubscription;
	}, []);

	async function getUserInfo(serial) {
		const data = await userService.getUserInfo(serial);

		return data._data;
	}

	function logoutUser() {
		return dispatch(reduxServices.userStatus(0));
	}

	if (!isLoaded)
		return <Text>Loading</Text>;

	return (
		<View style = { container }>
			<View style = { rowAlign }>
				<Button
					buttonStyle = {{ backgroundColor: 'red' }}
					title = 'LOG OUT'
					onPress = { () => logoutUser() }
				/>
				<View />
			</View>
			<View style = { form }>
				<View style = { center }>
					<Text>User: { user.name } </Text>
					<Text>Email: { user.email } </Text>
					<Text>Device Serial: { serial } </Text>
				</View>
			</View>
			<Navbar
				currentPage = '1'
				navigation = { navigation }
			/>
		</View>
	);
};