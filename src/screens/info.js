import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as reduxServices from '../ducks/userReducers';
import { useState } from 'react';
import { Button, Divider, LinearProgress } from 'react-native-elements';
import * as userService from '../services/user';
import { Navbar } from '../components/navbar';
import { styles } from '../styles';
import { Header } from '../components';

export const Info = ({ navigation }) => {
	const { container, form, center, reverseRowAlign } = styles;
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

	if (!isLoaded) {
		return (
			<View style = { container }>
				<Header heading = 'Pill3 2021-22' />
				<View style = {{ width: '60%', alignSelf: 'center' }}>
					<LinearProgress color = 'rgba(78, 116, 289, 1)' variant = 'indeterminate' />
				</View>
				<Navbar
					currentPage = '1'
					navigation = { navigation }
				/>
			</View>
		);
	}

	const infoTitle = { fontSize: 20, fontWeight: 'bold' };
	const infoBody = { fontSize: 20 };
	const divider = (width) => <Divider width = { width } />;

	return (
		<View style = { container }>
			<Header heading = 'Pill3 2021-22' />
			<View style = { reverseRowAlign }>
				<Button
					buttonStyle = {{ backgroundColor: 'red' }}
					title = 'LOG OUT'
					onPress = { () => logoutUser() }
				/>
				<View />
			</View>
			<View style = { form }>
				<View style = { [center, { alignItems: 'flex-start' }] }>
					<Text style = { [ infoTitle, { alignSelf: 'center' }] }>User Information</Text>
					{ divider(20) }
					<Text style = { infoTitle }>User: </Text>
					<Text style = { infoBody }>{ user.name }</Text>
					{ divider(20) }
					<Text style = { infoTitle }>Email: </Text>
					<Text style = { infoBody }>{ user.email }</Text>
					{ divider(20) }
					<Text style = { infoTitle }>Device Serial: </Text>
					<Text style = { infoBody }>{ serial }</Text>
					{ divider(100) }
				</View>
			</View>
			<Navbar
				currentPage = '1'
				navigation = { navigation }
			/>
		</View>
	);
};