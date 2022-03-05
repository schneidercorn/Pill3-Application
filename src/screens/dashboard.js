import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { Button } from 'react-native-elements';

export const Dashboard = ({ navigation }) => {
	const { serial } = useSelector(state => state.user);
	const [ pills, setPills ] = useState([]);
	const [ isLoaded, setLoaded ] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchData() {
			dispatch(loadUser());
			setPills(await getPills(serial));
			setLoaded(true);
		}

		fetchData();
		const willFocusSubscription = navigation.addListener('focus', () => {
			fetchData();
		});

		return willFocusSubscription;
	}, []);

	async function getPills(serial) {
		const pillsData = await userServices.getPills(serial)
			.then(pillsData => {
				console.log(pillsData);

				return pillsData;
			});

		return pillsData;
	}

	if (!isLoaded)
		return <Text>Loading</Text>;

	return (
		<View>
			<Text>
				{ JSON.stringify(pills, null, 4) }
			</Text>
			<Button
				title = 'ADD NEW PILL'
				onPress = { () => navigation.navigate('EditEntry') }
			/>
		</View>
	);
};