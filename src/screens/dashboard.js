import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as pillServices from '../services/pill';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { ListItem, Tab, TabView } from 'react-native-elements';
import { Navbar } from '../components/navbar';
import { styles } from '../styles';
import { LinearGradient } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Dashboard = ({ navigation }) => {
	const { container, pillListContainer, pillContainer, title } = styles;
	const { serial } = useSelector(state => state.user);
	const [index, setIndex] = React.useState(0);
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

	async function getPill(name) {
		return await pillServices.getPillFromName(serial, name);
	}

	async function getPills(serial) {
		const raw = await pillServices.getPills(serial);

		// separate pills by time
		let timeSeperated = [];

		raw.map(pill => {
			let times = pill.dosesThroughDay;

			times.map(time => {
				let newPill = JSON.parse(JSON.stringify(pill));

				newPill.dosesThroughDay = time;

				timeSeperated.push(newPill);
			});
		});

		// separate pills by day
		let weekSeperated = [[], [], [], [], [], [], []];

		timeSeperated.map(pill => {
			const repeat = pill.repeatOn;

			for (let i = 0; i < 7; i++) {
				if (repeat[i]) {
					const newPill = { name: pill.name, time: pill.dosesThroughDay };

					weekSeperated[i].push(newPill);
				}
			}
		});

		// sort pills in order of dispense every day
		for (let i = 0; i < weekSeperated.length; i++)
			weekSeperated[i] = weekSeperated[i].sort((a, b) => (a.time > b.time) ? 1 : -1);

		return weekSeperated;
	}

	function tab(title) {
		return (
			<Tab.Item
				title = { title }
				titleStyle = {{ fontSize: 10 }}
			/>
		);
	}

	function renderTabItems() {
		const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

		return days.map(day => tab(day));
	}

	function renderTabView() {
		return (
			<TabView
				value = { index }
				onChange = { setIndex }
				animationType = 'spring'
			>
				{ renderTabViewItems() }
			</TabView>
		);
	}

	function renderTabViewItems() {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		return (
			days.map((day, i) =>
				<TabView.Item style = { pillListContainer }>
					<>
						<Text style = { title }> { day } </Text>
						{ renderPills(pills[i]) }
					</>
				</TabView.Item>
			)
		);
	}

	function renderPills(day) {
		return (
			day.map(pill =>
				<ListItem
					Component = { TouchableOpacity }
					containerStyle = { pillContainer }
					friction = { 90 }
					tension = { 100 } // These props are passed to the parent component (here TouchableScale)
					activeScale = { 0.95 }
					onPress = { async () => navigation.navigate('EditEntry', { pill: await getPill(pill.name) }) }
				>
					<ListItem.Content>
						<ListItem.Title style = {{ color: 'white', fontWeight: 'bold' }}>
							{ pill.name }
						</ListItem.Title>
						<ListItem.Subtitle style = {{ color: 'white' }}>
							{ pill.time }
						</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			)
		);
	}

	if (!isLoaded)
		return <Text>Loading</Text>;

	return (
		<View style = { container }>
			<Tab
				value = { index }
				onChange = { (e) => setIndex(e) }
				scrollable
				variant = 'primary'
				indicatorStyle = {{
					backgroundColor: 'white',
					height: 3
				}}
			>
				{ renderTabItems() }
			</Tab>
			{ renderTabView() }
			<Navbar
				currentPage = '0'
				navigation = { navigation }
			/>
		</View>
	);
};