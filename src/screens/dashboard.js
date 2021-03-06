import React, { useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as pillServices from '../services/pill';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { LinearProgress, ListItem, Tab, TabView } from 'react-native-elements';
import { Header, Navbar } from '../components';
import { styles } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export const Dashboard = ({ navigation }) => {
	const daysAbbr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const { container, pillListContainer, pillContainer, title, nextDispenseContainer } = styles;
	const { serial } = useSelector(state => state.user);
	// finds today's day (Sunday - Saturday) in terms of indices 0 - 6
	const [ index, setIndex] = React.useState(new Date(Date.now()).getDay());
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
				try {
					let newPill = JSON.parse(JSON.stringify(pill));

					newPill.dosesThroughDay = time;

					timeSeperated.push(newPill);
				}
				catch (e) { null }
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

	// Memoize tabs
	const tabs = useMemo(() => daysAbbr.map(day =>
		<Tab.Item
			title = { day }
			titleStyle = {{ fontSize: 10 }}
		/>
	), []);

	function renderTabItems() {
		return <Tab
			value = { index }
			onChange = { (e) => setIndex(e) }
			scrollable
			variant = 'primary'
			indicatorStyle = {{
				backgroundColor: 'white',
				height: 3
			}}
		>
			{ tabs }
		</Tab>;
	}

	function renderTabView() {
		return (
			<TabView
				value = { index }
				onChange = { setIndex }
				animationType = 'spring'
			>
				{
					days.map((day, i) =>
						<TabView.Item style = { pillListContainer }>
							<>
								<Text style = { title }> { day } </Text>
								{ renderPills(pills[i]) }
							</>
						</TabView.Item>
					)
				}
			</TabView>
		);
	}

	const militaryTo12hour = (militaryTime) => {
		let isPM = false;

		let hours = Number(militaryTime.split(':')[0]);
		let minutes = militaryTime.split(':')[1];

		if (hours == 0) {
			hours = 12;
		}
		else if (hours == 12) {
			isPM = true;
		}
		else if (hours > 12) {
			isPM = true;
			hours -= 12;
		}

		return `${ hours }:${ minutes }` + (isPM ? 'pm' : 'am');
	};

	function renderPills(day) {
		return (
			<>
				{ day.map(pill =>
					<ListItem
						Component = { View }
						containerStyle = { pillContainer }
						friction = { 90 }
						tension = { 100 }
						activeScale = { 0.95 }
					>
						<ListItem.Content style = {{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
							<View style = {{ flexDirection: 'column', width: 200 }}>
								<ListItem.Title style = {{ color: 'white', fontWeight: 'bold' }}>
									{ pill.name }
								</ListItem.Title>
								<ListItem.Subtitle style = {{ color: 'white' }}>
									{ militaryTo12hour(pill.time) }
								</ListItem.Subtitle>
							</View>
							<TouchableOpacity onPress = { async () => navigation.navigate('EditEntry', { pill: await getPill(pill.name) }) }>
								<FontAwesomeIcon
									icon = { faPenToSquare }
									size = { 24 }
									style = {{ color: 'white' }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress = { async () => {
									Alert.alert(
										'This will delete all ' + pill.name + ' entries',
										'Are you sure you want to do that?',
										[
											{
											  text: 'Cancel',
											  style: 'cancel'
											},
											{
												text: 'Delete',
												// eslint-disable-next-line max-len
												onPress: async () => await pillServices.deletePill(serial, await pill.name)
											}
										  ]
									);
								} }
							>
								<FontAwesomeIcon
									icon = { faTrashCan }
									size = { 24 }
									style = {{ color: 'white' }}
								/>
							</TouchableOpacity>
						</ListItem.Content>
					</ListItem>
				) }
			</>
		);
	}

	function renderNextDispense() {
		const calculateNextDispense = () => {
			const now = new Date(Date.now());
			const todayPills = pills[now.getDay()];

			for (let i = 0; i < todayPills.length; i++) {
				const todayPillTime = todayPills[i].time.split(':');

				const pillHour = Number(todayPillTime[0]);
				const pillMinute = Number(todayPillTime[1]);

				if (pillHour > now.getHours())
					return todayPills[i].name + ' at ' + militaryTo12hour(todayPills[i].time);
				else if (pillHour == now.getHours() && pillMinute >= now.getMinutes())
					return todayPills[i].name + ' at ' + militaryTo12hour(todayPills[i].time);
			}

			return 'No more dispenses today!';
		};

		return (
			<View style = { nextDispenseContainer }>
				<Text style = {{ fontSize: 18, fontWeight: 'bold' }}> Next dispense today:</Text>
				<Text style = {{ fontSize: 18 }}> { calculateNextDispense() } </Text>
			</View>
		);
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

	return (
		<View style = { container }>
			<Header heading = 'Pill3 2021-22' />
			{ renderTabItems() }
			{ renderTabView() }
			{ renderNextDispense() }
			<Navbar
				currentPage = '0'
				navigation = { navigation }
			/>
		</View>
	);
};