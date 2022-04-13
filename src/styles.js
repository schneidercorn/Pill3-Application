export const styles = {
	container: {
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(245, 245, 255, 1)',
		justifyContent: 'space-between',
		flex: 1,
		flexDirection: 'column'
	},
	form: {
		width: '80%',
		justifyContent: 'space-around',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	scrollForm: {
		width: '100%',
		justifyContent: 'space-around',
		flexDirection: 'column',
		alignItems: 'center'
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	reverseRowAlign: {
		height: 75,
		width: '100%',
		alignItems: 'center',
		flexDirection: 'row-reverse',
		paddingLeft: 25
	},
	header: {
		position: 'relative',
		height: '40%',
		width: '80%',
		alignSelf: 'center'
	},
	extendedScrollView: {
		height: 200,
		width: '100%'
	},
	rowAlign: {
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingVertical: 15
	},
	pillListContainer: {
		height: '90%',
		justifyContent: 'flex-start',
		flex: 1,
		flexDirection: 'column'
	},
	pillContainer: {
		backgroundColor: 'rgba(78, 116, 289, 1)',
		width: '90%',
		height: 60,
		alignSelf: 'center',
		borderRadius: 12,
		marginVertical: 5,

		shadowColor: 'black',
		shadowOffset: {
			width: 30,
			height: 1
		},
		shadowOpacity: 1,
		shadowRadius: 10,

		elevation: 4
	},
	nextDispenseContainer: {
		height: 110,
		width: '100%',
		zIndex: 0,
		backgroundColor: 'white',
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		paddingBottom: 20,

		shadowColor: 'black',
		shadowOffset: {
			width: 2,
			height: 1
		},
		shadowOpacity: 1,
		shadowRadius: 1,

		elevation: 4
	}
};