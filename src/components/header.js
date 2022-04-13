import React from 'react';
import { Text } from 'react-native';

export const Header = ({ heading }) => {
	const container = {
		fontSize: 12,
		color: 'white',
		textAlign: 'center',
		backgroundColor: 'rgba(78, 116, 289, 1)'
	};

	return <Text
		style = { container }
	>
		{ heading }
	</Text>;
};