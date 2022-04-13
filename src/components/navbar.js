import React from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Navbar = ({ navigation, currentPage }) => {
	const { container, bar, circle, icon } = styles;

	return (
		<View style = { container }>
			<View style = { bar }>
				<TouchableOpacity onPress = { () => navigation.navigate('Dashboard') }>
					<FontAwesomeIcon
						icon = { faCalendar }
						size = { 35 }
						style = { currentPage == 0 ? icon : [ icon, { color: 'black' }] }
					/>
				</TouchableOpacity>
				<TouchableOpacity style = { circle } onPress = { () => navigation.navigate('EditEntry') }>
					<FontAwesomeIcon
						icon = { faPlus }
						size = { 45 }
						style = { icon }
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress = { () => navigation.navigate('Info') }>
					<FontAwesomeIcon
						icon = { faUser }
						size = { 35 }
						style = { currentPage == 1 ? icon : [ icon, { color: 'black' }] }
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = {
	container: {
		height: 80,
		width: '100%'
	},
	bar: {
		height: '100%',
		width: '100%',
		backgroundColor: '#5194CF',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	icon: {
		color: 'white'
	},
	circle: {
		height: 100,
		width: 100,
		borderWidth: 6,
		borderColor: 'white',
		borderRadius: 150,
		backgroundColor: '#5194CF',
		marginTop: -45,
		alignItems: 'center',
		justifyContent: 'center',

		shadowColor: 'black',
		shadowOffset: {
			width: 30,
			height: 1
		},
		shadowOpacity: 1,
		shadowRadius: 10,

		elevation: 4
	}
};