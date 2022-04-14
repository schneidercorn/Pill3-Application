import React, { useEffect } from 'react';
import { Alert, PushNotificationIOS } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';

PushNotification.configure({
	// (optional) Called when Token is generated (iOS and Android)
	onRegister: function (token) {
	  console.log('TOKEN:', token);
	},

	// (required) Called when a remote is received or opened, or local notification is opened
	onNotification: function (notification) {
	  console.log('NOTIFICATION:', notification);

	  // (required) Called when a remote is received or opened, or local notification is opened
	  notification.finish(PushNotificationIOS.FetchResult.NoData);
	},

	// (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
	onAction: function (notification) {
	  console.log('ACTION:', notification.action);
	  console.log('NOTIFICATION:', notification);

	  // process the action
	},

	popInitialNotification: true,
	requestPermissions: true
});

PushNotification.createChannel(
	{
		channelId: '2', // (required)
		channelName: 'Pill Dispenses', // (required)
		channelDescription: 'A channel to show pill dispenses', // (optional) default: undefined.
		playSound: true, // (optional) default: true
		soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
		importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
		vibrate: true // (optional) default: true. Creates the default vibration pattern if true.
	},
	(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export const addNotifications = pills => {
	// delete old notifications
	PushNotification.cancelAllLocalNotifications();

	// set times for notifications
	pills.map(pill => {
		pill.dosesThroughDay.map(time => {
			const message = `${ pill.name } is being dispensed!`;

			const hours = Number(time.split(':')[0]);
			const minutes = Number(time.split(':')[1]);

			const date = new Date(Date.now());

			date.setHours(hours, minutes, 0);

			console.log('date: ' + date);

			PushNotification.localNotificationSchedule({
				channelId: '2',
				message: message,
				date: date,
				allowWhileIdle: true
			});
		});
	});

	PushNotification.getScheduledLocalNotifications(notifs => console.log(JSON.stringify(notifs, null, 4)));

	return true;
};