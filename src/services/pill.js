import firestore from '@react-native-firebase/firestore';
import { onChange } from 'react-native-reanimated';

export const getPills = async serial => {
	const pills = [];

	await firestore()
		.collection('serials')
		.doc(String(serial))
		.collection('pills')
		.get()
		.then(snapshot => {
			snapshot.docs.forEach(doc => pills.push(doc._data));
		});

	return pills;
};

export const addPill = async (serial, pill) => {
	const pills = await getPills(serial);

	await deletePill(serial, pill.name);

	return await firestore()
		.collection('serials')
		.doc(String(serial))
		.collection('pills')
		.add(pill)
		.then(() => true)
		.catch(() => false);
};

export const getPillFromName = async (serial, name) => {
	const pills = [];

	await firestore()
		.collection('serials')
		.doc(String(serial))
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

export const deletePill = async (serial, name) => {
	let pillHash = '';
	
	await firestore()
		.collection('serials')
		.doc(String(serial))
		.collection('pills')
		.get()
		.then(snapshot => snapshot.docs
			.forEach(doc => {
				if (doc._data.name == name)
					pillHash = doc._ref._documentPath._parts[3];
			})
		);
	
	if (pillHash != '') {
		await firestore()
			.collection('serials')
			.doc(String(serial))
			.collection('pills')
			.doc(pillHash)
			.delete()

		return true;
	}

	return false;
}

export const isSlotTaken = async (serial, slot) => {
	let slotTaken = false;
	
	await firestore()
		.collection('serials')
		.doc(String(serial))
		.collection('pills')
		.get()
		.then(snapshot => {
			snapshot.docs.forEach(doc => {
				if (String(slot) == doc._data.slot) {
					slotTaken = true;
					
					return;
				}
			});
		});

		return slotTaken;
}