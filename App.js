import React from 'react';
import Router from './src/router';

const App = () => {
	const isLoggedIn = false;
	const isLoading = false;

	return <Router
		isLoggedIn = { isLoggedIn }
		isLoading = { isLoading }
	/>;
};

export default App;