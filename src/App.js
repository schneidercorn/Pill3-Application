import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './ducks/userReducers';
import Router from './router';
import { NotificationSystem } from './components/notifs';

const App = () => {
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector(state => state.user);

	useEffect(() => {
		dispatch(loadUser());
	}, []);

	return <>
		<NotificationSystem />
		<Router
			isLoggedIn = { isLoggedIn }
		/>
	</>;
};

export default App;