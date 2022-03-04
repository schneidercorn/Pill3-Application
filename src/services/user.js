import firestore from '@react-native-firebase/firestore';

export const createUser = user => {
	const { name, email, serial } = user;

	firestore()
		.collection('serials')
		.doc(serial)
		.set({
			name: name,
			email: email
		})
		.then(() => {
			console.log('added ${ name } to firestore.');
		});
};

export const getUserInfo = async serial => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.get()
		.then(data => data.data());
};

export const getUserStatus = async serial => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.get()
		.then(data => data.data());
};

export const serialExists = async serial => {
	return await firestore()
		.collection('serials')
		.doc(serial)
		.get()
		.then(data => data.exists);
};