import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const NotificationSystem = () => {
	messaging().setBackgroundMessageHandler(async remoteMessage => {
		Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
	});

	useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			messaging().registerDeviceForRemoteMessages();
			Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
		});

		return unsubscribe;
	}, []);

	return (
		<></>
	);
};