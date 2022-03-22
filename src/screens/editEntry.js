import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import * as pillServices from '../services/pill';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';
import { Button, ButtonGroup, Input } from 'react-native-elements';
import { Navbar } from '../components/navbar';
import { ScrollView } from 'react-native-gesture-handler';

export const EditEntry = ({ navigation }) => {
	const { container, extendedScrollView } = styles;
	const [ slot, setSlot ] = useState(1);
	const [ name, setName ] = useState('');
	const [ dosage, setDosage ] = useState('');
	const [ dosesPerDay, setDosesPerDay ] = useState(1);
	const [ dosesThroughDay, setDosesThroughDay ] = useState(['']);
	const [ selectedDays, setSelectedDays ] = useState([ ]);
	const { serial } = useSelector(state => state.user);
	const dispatch = useDispatch();

	useEffect(async () => {
		dispatch(loadUser());
	}, []);

	function renderDosesPerDayFields() {
		let ids = [ 1 ];
		const length = dosesThroughDay.length;

		/*
		 * i can't believe this works, but im not changing it unless neccessary.
		 *
		 * all it does is allows the link between id and dosesPerDay so we can
		 * easily manage their relationship with the <Input /> fields
		 */
		if (length == 1) ids = [ 1 ];
		if (length == 2) ids = [ 1, 2 ];
		if (length == 3) ids = [ 1, 2, 3 ];
		if (length == 4) ids = [ 1, 2, 3, 4 ];

		return (
			ids.map(id =>
				<Input
					key = { id }
					label = 'Time'
					onChangeText = { input => {
						const newArray = dosesThroughDay;

						newArray[id - 1] = input;

						return newArray;
					} }
				/>
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
			<ScrollView>
				<Input
					label = 'Name'
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
				<View>
					<Text> Doses per Day: { dosesPerDay } </Text>
					{ /* increase dosesPerDay */ }
					<Button
						title = '+'
						onPress = { () => {
							if (dosesPerDay == 4)
								return;

							dosesThroughDay.push('');
							setDosesPerDay(dosesPerDay + 1);
						} }
					/>
					{ /* decrease dosesPerDay */ }
					<Button
						title = '-'
						onPress = { () => {
							if (dosesPerDay == 1)
								return;

							dosesThroughDay.pop();
							setDosesPerDay(dosesPerDay - 1);
						} }
					/>
					{ renderDosesPerDayFields() }
				</View>
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