import firestore from '@react-native-firebase/firestore';

export const createUser = async user => {
	const { name, email, serial } = user;
	const serialExists = await firestore()
		.collection('serials')
		.doc(serial)
		.get()
		.then(data => data.exists);

	if (serialExists)
		return false;

	const doc = firestore()
		.collection('serials')
		.doc(serial);

	// serial document
	doc.set({
		name: name,
		email: email
	});

	// pills collection
	doc.collection('pills');

	return true;
};

export const getUserInfo = async serial => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.get();
};

export const loginUser = async serial => {
	return firestore()
		.collection('serials')
		.doc(serial)
		.get()
		.then(data => {
			if (data.exists) {
				return ({
					isLoggedIn: true,
					serial: `${serial}`
				});
			}

			return ({ isLoggedIn: false });
		});
};

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