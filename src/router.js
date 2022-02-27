import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
	/* Onboarding   */ Splash, Login, Register,
	/* General      */ Dashboard, Info, EditEntry
} from './index';

const AuthStack = createStackNavigator();
const OnboardingStack = createStackNavigator();
const MainStack = createStackNavigator();

const OnboardingStackNavigator = () => {
	<OnboardingStack.Navigator screenOptions = {{ headerShown: false }}>
		<OnboardingStack.Screen name = 'Splash' component = { Splash } />
	</OnboardingStack.Navigator>;
};

const AuthStackNavigator = () => {
	<AuthStack.Navigator screenOptions = {{ headerShown: false }}>
		<AuthStack.Screen name = 'Login' component = { Login } />
		<AuthStack.Screen name = 'Register' component = { Register } />
	</AuthStack.Navigator>;
};

const MainStackNavigator = () => {
	<MainStack.Navigator screenOptions = {{ headerShown: false }}>
		<MainStack.Screen name = 'Dashboard' component = { Dashboard } />
		<MainStack.Screen name = 'Info' component = { Info } />
		<MainStack.Screen name = 'EditEntry' component = { EditEntry } />
	</MainStack.Navigator>;
};

export default ({ isLoading, isLoggedIn }) => (
	<NavigationContainer>
		{ isLoading ? <OnboardingStackNavigator /> :
			!isLoggedIn ? <AuthStackNavigator /> : <MainStackNavigator />
		}
	</NavigationContainer>
);