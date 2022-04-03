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
		.then(() => true)
		.catch(() => false);
};

export const getPillFromName = async (serial, name) => {
	const pills = [];

	await firestore()
		.collection('serials')
		.doc(serial)
		.collection('pills')
		.get()
		.then(snapshot => {
			snapshot.docs.forEach(doc => pills.push(doc._data));
		});

	return pills.map(pill => {
		if (pill.name == name)
			return pill;
	}).filter(element => {
		return element !== undefined;
	})[0];
};