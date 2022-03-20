import firestore from '@react-native-firebase/firestore';

export const getPills = async serial => {
	const pills = [];

	await firestore()
		.collection('serials')
		.doc(serial)
		.collection('pills')
		.get()
		.then(snapshot => {
			snapshot.docs.forEach(doc => pills.push(doc._data));
		});

	return pills;
};

export const addPill = async (serial, pill) => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.collection('pills')
		.add(pill)
		.then(() => {
			console.log('added pill to database: ' + JSON.stringify(pill));

			return true;
		})
		.catch(() => false);
};