import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './ducks/userReducers';
import Router from './router';

const App = () => {
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector(state => state.user);

	useEffect(() => {
		dispatch(loadUser());
	}, []);

	return <Router
		isLoggedIn = { isLoggedIn }
	/>;
};

export default App;