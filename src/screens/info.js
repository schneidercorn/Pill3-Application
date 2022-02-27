import * as userService from '../index';

export const Info = () => {
	function getUserInfo(serial) {
		const data = userService.getUserInfo(serial);

		console.log(data);

		return data;
	}

	return null;
};