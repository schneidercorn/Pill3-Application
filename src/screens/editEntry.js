import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import * as pillServices from '../services/pill';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { Button, ButtonGroup, Divider, Input } from 'react-native-elements';
import { Navbar } from '../components/navbar';
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../styles';
import DatePicker from 'react-native-date-picker';
import * as notification from '../services/notification';

export const EditEntry = ({ navigation, route }) => {
	const { container, extendedScrollView, scrollForm, rowAlign } = styles;
	const [ slot, setSlot ] = useState(1);
	const [ name, setName ] = useState('');
	const [ numDispense, setNumDispense ] = useState('');
	const [ dosesPerDay, setDosesPerDay ] = useState(1);
	const [ dosesThroughDay, setDosesThroughDay ] = useState(['']);
	const [ selectedDays, setSelectedDays ] = useState([]);
	const [ repeatOn, setRepeatOn ] = useState([]);
	const { serial } = useSelector(state => state.user);
	const [ isLoaded, setLoaded ] = useState(false);
	const [ isEditing, setIsEditing ] = useState(!!route.params && !!route.params.pill);
	const dispatch = useDispatch();

	useEffect(() => {
		function load() {
			// edit pill
			if (isEditing) {
				const pill = route.params.pill;

				setSlot(pill.slot);
				setName(pill.name);
				setNumDispense(pill.numDispense);
				setDosesPerDay(pill.dosesThroughDay.length);
				setDosesThroughDay(pill.dosesThroughDay);
				setSelectedDays(pill.repeatOn.map((day, i) => {
					if (day)
						return i;
				}));
				setRepeatOn(pill.repeatOn);
			}
		}

		dispatch(loadUser());
		load();

		setLoaded(true);
	}, []);

	function renderDosesPerDayFields() {
		let ids = [ 1 ];
		const [ date, setDate ] = useState([new Date(), new Date(), new Date(), new Date()]);
		const length = dosesThroughDay.length;

		if (!isLoaded)
			return <Text>Loading...</Text>;

		/*
		 * i can't believe this works, but im not changing it unless neccessary.
		 *
		 * all it does is allows the link between id and dosesPerDay so we can
		 * easily manage their relationship with the <DatePicker /> fields
		 */
		if (length == 1) ids = [ 1 ];
		if (length == 2) ids = [ 1, 2 ];
		if (length == 3) ids = [ 1, 2, 3 ];
		if (length == 4) ids = [ 1, 2, 3, 4 ];

		if (isEditing) {
			ids.map(id => {
				const timeRaw = dosesThroughDay[id - 1];
				const timeSplit = timeRaw.split(':');

				date[id - 1].setHours(timeSplit[0], timeSplit[1], 0);
			});
		}

		return (
			ids.map(id => {
				const time = dosesThroughDay[id - 1];
				const newTime = Number(time.split(':')[0] * 3600);

				return <>
					<Text> { 'Dispense #' + id } </Text>
					<DatePicker
						key = { id }
						mode = 'time'
						date = { date[id - 1] }
						minuteInterval = { 5 }
						timeZoneOffsetInMinutes = { -240 }
						onDateChange = { input => {
							const newArray = dosesThroughDay;

							// convert timestamp to 00:00 format
							const strInput = input.toTimeString().substring(0, 5);

							newArray[id - 1] = strInput;

							return newArray;
						} } />
					<Divider width = { 10 } />
				</>;
			})
		);
	}

	async function addPill() {
		const pill = {
			name: name,
			numDispense: numDispense,
			slot: slot,
			dosesThroughDay: dosesThroughDay,
			repeatOn: repeatOn
		};

		if (isEditing || !(await pillServices.isSlotTaken(serial, pill.slot))) {
			return await pillServices.addPill(serial, pill)
				.then(async () => {
					const pills = await pillServices.getPills(serial);

					return notification.addNotifications(pills);
				});
		}

		return;
	}

	return (
		<View style = { container }>
			<ScrollView contentContainerStyle = { scrollForm }>
				<Input
					label = 'Pill Name'
					onChangeText = { name => setName(name) }
					value = { name }
				/>
				<Input
					label = 'Number of Pills to Dispense'
					onChangeText = { numDispense => setNumDispense(numDispense) }
					value = { numDispense }
				/>
				<ButtonGroup
					buttons = { [1, 2, 3] }
					selectedIndex = { slot }
					onPress = { (value) => {
						setSlot(value);
					} }
				/>
				<Text> Doses per Day: { dosesPerDay + '\n' } </Text>
				<View style = { rowAlign }>
					{ /* decrease dosesPerDay */ }
					<Button
						title = '      -      '
						onPress = { () => {
							if (dosesPerDay == 1)
								return;

							dosesThroughDay.pop();
							setDosesPerDay(dosesPerDay - 1);
						} }
					/>
					{ /* increase dosesPerDay */ }
					<Button
						title = '      +      '
						onPress = { () => {
							if (dosesPerDay == 4)
								return;

							dosesThroughDay.push('');
							setDosesPerDay(dosesPerDay + 1);
						} }
					/>
				</View>
				{ renderDosesPerDayFields() }
				<ButtonGroup
					buttons = { ['S', 'M', 'T', 'W', 'Th', 'F', 'S'] }
					selectMultiple
					selectedIndexes = { selectedDays }
					onPress = { (selectedIndexes) => {
						const newRepeatOn = [ false, false, false, false, false, false, false ];

						for (let i = 0; i < newRepeatOn.length; i++) {
							const dayIndex = selectedIndexes[i];

							newRepeatOn[dayIndex] = true;
						}

						setSelectedDays(selectedIndexes);
						setRepeatOn(newRepeatOn);
					} }
				/>
				<Button
					title = 'ADD PILL'
					onPress = { async () => {
						if (await addPill())
							navigation.goBack();
					} }
				/>
				<View style = { extendedScrollView } />
			</ScrollView>
			<Navbar
				currentPage = '2'
				navigation = { navigation }
			/>
		</View>
	);
};