class firebaseMethods {
	constructor (name) {
		this.name = name;
		this.firebaseConfig = {
		    apiKey: "AIzaSyCuCvjoqB3RahVh0tNDmLL7g0UntJYeZkA",
		    authDomain: "leaderboard-games.firebaseapp.com",
		    databaseURL: "https://leaderboard-games.firebaseio.com",
		    projectId: "leaderboard-games",
		    storageBucket: "leaderboard-games.appspot.com",
		    messagingSenderId: "1021355189255",
		    appId: "1:1021355189255:web:2051230afca29dbcc376a2"
		};
		this.fireDB = firebase.initializeApp(this.firebaseConfig);
		this.myDB = firebase.firestore();		
		this.loginList = this.myDB.collection(`logins`);
		this.shultResults = this.myDB.collection(`tableShultResult`);
	}

	setUser(userName, uuid) {
		this.loginList.doc(uuid).set({
			userName: userName,
			sessionId: uuid,
			sign: true
		}).then(function() {
		}).catch(function(error) {
			console.log(error);
		});
	}

	signOutUser(userName, uuid) {
		this.loginList.doc(uuid).set({
			userName: userName,
			sessionId: uuid,
			sign: false
		}).then(function() {
		}).catch(function(error) {
			console.log(error);
		});
	}

	checkUser(uuid) {
		this.loginList.doc(uuid).get()
		.then(function(doc) {
			if (doc.exists) {				
				if (doc.data().sign) {
					authLogic.userName = doc.data().userName;
					authLogic.sendUserName();
				}
			} else {
				return false;
			}
		}).catch(function(error) {
			if (error) {
				console.log(error);
			}
			return false;
		});
	}

	shultSaveRes(userName, time, tablesize) {
		this.myDB.collection(`tableShultResult_${tablesize}x${tablesize}`).doc(userName).get()
		.then(function(doc) {
			if (doc.exists) {
				if (doc.data().time > time) {
					firebaseApp.myDB.collection(`tableShultResult_${tablesize}x${tablesize}`).doc(userName)
					.set({time: time});
				} else {
					return;
				}
			} else {
				firebaseApp.myDB.collection(`tableShultResult_${tablesize}x${tablesize}`).doc(userName)
				.set({time: time});
			}
		})
	}

	sortAndPrintResults(arr, printPlace) {		
		for (let i = 0; i < arr.length; i++) {
			if (i < 10) {
				let tempArr = arr[i].split(`#/toSplit`);
		    	document.getElementById(`${printPlace}`).innerHTML += `
		    	<div class="docData"><b>${tempArr[1]}</b><div><div>${tempArr[0]}</div>
		    	`;
			}
		}
	}

	loadBestResults() {
		this.myDB.collection("tableShultResult_4x4").get().then(function(querySnapshot) {
			let arrRes = [];
			querySnapshot.forEach(function(doc) {
				arrRes.push(`${doc.data().time}#/toSplit${doc.id}`);
		    });
		    firebaseApp.sortAndPrintResults(arrRes.sort(), `shult4x4`);
		});

		this.myDB.collection("tableShultResult_5x5").get().then(function(querySnapshot) {
			let arrRes = [];
			querySnapshot.forEach(function(doc) {
				arrRes.push(`${doc.data().time}#/toSplit${doc.id}`);
		    });
		    firebaseApp.sortAndPrintResults(arrRes.sort(), `shult5x5`);
		});

		this.myDB.collection("tableShultResult_6x6").get().then(function(querySnapshot) {
			let arrRes = [];
			querySnapshot.forEach(function(doc) {
				arrRes.push(`${doc.data().time}#/toSplit${doc.id}`);
		    });
		    firebaseApp.sortAndPrintResults(arrRes.sort(), `shult6x6`);
		});

		this.myDB.collection("tableShultResult_7x7").get().then(function(querySnapshot) {
			let arrRes = [];
			querySnapshot.forEach(function(doc) {
				arrRes.push(`${doc.data().time}#/toSplit${doc.id}`);
		    });
		    firebaseApp.sortAndPrintResults(arrRes.sort(), `shult7x7`);
		});

		this.myDB.collection("tableShultResult_8x8").get().then(function(querySnapshot) {
			let arrRes = [];
			querySnapshot.forEach(function(doc) {
				arrRes.push(`${doc.data().time}#/toSplit${doc.id}`);
		    });
		    firebaseApp.sortAndPrintResults(arrRes.sort(), `shult8x8`);
		});
	}

	getArrRes(userName, time , tableSize) {
		this.myDB.collection(`UserList`).doc(userName).get().then(function(doc) {
			let arr = [];
			if (doc.exists) {
				arr = doc.data()[tableSize];
				if (arr) {
					arr.push(time);
				} else {
					arr = [time];
				}
				firebaseApp.saveArrRess(userName, arr, tableSize);
			} else {
				arr = [time];
				firebaseApp.saveArrRess(userName, arr, tableSize, true);
			}
		}).catch(function(error) {
			console.log(error);
		});
	}

	getAllResults(userName) {
		this.myDB.collection(`UserList`).doc(userName).get().then(function(doc) {
			if (doc.exists) {
				stat.resultsObj = {
					arr4x4: doc.data()[`4x4`],
					arr5x5: doc.data()[`5x5`],
					arr6x6: doc.data()[`6x6`],
					arr7x7: doc.data()[`7x7`],
					arr8x8: doc.data()[`8x8`]
				};
				stat.createCanvas();
			} else {
				stat.noInfo();
			}
			
		}).catch(function(error) {
			console.log(error);
		});
	}

	saveArrRess(userName, arr, tableSizeString, newBoolean) {
		if (newBoolean) {
			this.myDB.collection(`UserList`).doc(userName).set({
				[tableSizeString]: arr
			}).catch(function(error) {
				console.log(error);
			});
		} else {
			this.myDB.collection(`UserList`).doc(userName).update({
				[tableSizeString]: arr
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}

const firebaseApp = new firebaseMethods(`firebaseApp`);