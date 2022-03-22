import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import * as pillServices from '../services/pill';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { Button } from 'react-native-elements';
import { Navbar } from '../components/navbar';
import { ScrollView } from 'react-native-gesture-handler';

export const Dashboard = ({ navigation }) => {
	const { container, extendedScrollView } = styles;
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
		const pillsData = await pillServices.getPills(serial)
			.then(pillsData => {
				console.log(pillsData);

				return pillsData;
			});

		return pillsData;
	}

	if (!isLoaded)
		return <Text>Loading</Text>;

	return (
		<View style = { container }>
			<ScrollView>
				<Text>
					{ JSON.stringify(pills, null, 4) }
				</Text>
				<View style = { extendedScrollView } />
			</ScrollView>
			<Navbar
				currentPage = '0'
				navigation = { navigation }
			/>
		</View>
	);
};

const styles = {
	container: {
		height: '100%',
		width: '100%',
		justifyContent: 'space-between',
		flex: 1,
		flexDirection: 'column'
	},
	extendedScrollView: {
		height: 200,
		width: '100%'
	}
};