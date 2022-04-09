import firestore from '@react-native-firebase/firestore';

export const createUser = async user => {
	const { name, email, serial } = user;
	const serialExists = await firestore()
		.collection('serials')
		.doc(String(serial))
		.get()
		.then(data => data.exists);

	if (serialExists)
		return false;

	const doc = firestore()
		.collection('serials')
		.doc(String(serial));

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
		.doc(String(serial))
		.get();
};

export const loginUser = async serial => {
	return firestore()
		.collection('serials')
		.doc(String(serial))
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