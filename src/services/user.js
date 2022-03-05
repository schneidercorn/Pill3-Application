import firestore from '@react-native-firebase/firestore';

export const createUser = user => {
	const { name, email, serial } = user;

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
};

export const getUserInfo = async serial => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.get();
};

export const serialExists = async serial => {
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