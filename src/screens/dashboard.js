import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';

export const Dashboard = () => {
	const { serial } = useSelector(state => state.user);

	return <Text> { serial } </Text>;
};