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

export const EditEntry = ({ navigation }) => {
	const { container, extendedScrollView, scrollForm, rowAlign } = styles;
	const [ slot, setSlot ] = useState(1);
	const [ name, setName ] = useState('');
	const [ dosage, setDosage ] = useState('');
	const [ dosesPerDay, setDosesPerDay ] = useState(1);
	const [ dosesThroughDay, setDosesThroughDay ] = useState(['']);
	const [ selectedDays, setSelectedDays ] = useState([ ]);
	const { serial } = useSelector(state => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadUser());
	}, []);

	function renderDosesPerDayFields() {
		const [date, setDate] = useState(new Date());
		let ids = [ 1 ];
		const length = dosesThroughDay.length;

		/*
		 * i can't believe this works, but im not changing it unless neccessary.
		 *
		 * all it does is allows the link between id and dosesPerDay so we can
		 * easily manage their relationship with the <DateTimePickerModal /> fields
		 */
		if (length == 1) ids = [ 1 ];
		if (length == 2) ids = [ 1, 2 ];
		if (length == 3) ids = [ 1, 2, 3 ];
		if (length == 4) ids = [ 1, 2, 3, 4 ];

		return (
			ids.map(id =>
				<>
					<Text> { 'Dispense #' + id } </Text>
					<DatePicker
						mode = 'time'
						date = { date }
						minuteInterval = { 5 }
						timeZoneOffsetInMinutes = { -240 }
						onDateChange = { input => {
							const newArray = dosesThroughDay;

							// convert timestamp to 00:00 format
							const strInput = input.toTimeString().substring(0, 5);

							newArray[id - 1] = strInput;
							console.log(dosesThroughDay);

							return newArray;
						} } />
					<Divider width = { 10 } />
				</>
			)
		);
	}

	async function addPill() {
		const pill = {
			name: name,
			dosage: dosage,
			slot: slot,
			dosesThroughDay: dosesThroughDay,
			repeatOn: selectedDays
		};

		return await pillServices.addPill(serial, pill);
	}

	return (
		<View style = { container }>
			<ScrollView contentContainerStyle = { scrollForm }>
				<Input
					label = 'Pill Name'
					onChangeText = { name => setName(name) }
				/>
				<Input
					label = 'Dosage'
					onChangeText = { dosage => setDosage(dosage) }
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
					onPress = { (value) => {
						setSelectedDays(value);
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