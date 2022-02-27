import React from 'react';
import Router from './src/router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
	const isLoggedIn = false;
	const isLoading = false;

	return <Router
		isLoggedIn = { isLoggedIn }
		isLoading = { isLoading }
	/>;
};

export default App;