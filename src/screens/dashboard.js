import React from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as userServices from '../services/user';
import { useEffect } from 'react';
import { loadUser } from '../ducks/userReducers';
import { useState } from 'react';

export const Dashboard = () => {
	const { serial } = useSelector(state => state.user);
	const [ pills, setPills ] = useState([]);
	const [ isLoaded, setLoaded ] = useState(false);
	const dispatch = useDispatch();

	useEffect(async () => {
		dispatch(loadUser());
		setPills(await getPills(serial));
		setLoaded(true);
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
		<Text>
			{ serial + '\n' }
			{ JSON.stringify(pills, null, 4) }
		</Text>
	);
};