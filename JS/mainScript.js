let overlay = document.getElementById(`overlay`);
let ui = {
	navMenu: document.getElementById(`menu`),
	adoptMenu: document.querySelectorAll(`.hamburgerOpenItem`),
	mainContent: document.getElementById(`mainContent`)
};

const spaLogic = {
	state: {},
	mainPage: `main`,
	host: window.location.hash ? window.location.href.split('#')[0] : window.location.href,
	gameContent: {
		tableShult: {
			title: `Таблица Шульте`,
			content: `<div id="tableShultContainer" class="gameMainContainer"></div>`
		},
		canvasReact: {
			title: `Canvas React`,
			content: `<div id="canvasReactContainer" class="gameMainContainer">
			<canvas id="canvasReactTimer"></canvas>
			<canvas id="canvasReact"></canvas>
			</div>`
		}
	},
	content: {
		main: {
			title: `Главная страница`,
			content: `
			<div class="gameRow">
				<h2>Таблица Шульте</h2>
				<div class="gameContainer">
					<a href="tableShult">
						<img data-link="true" data-href="tableShult" src="Res/images/tableShult.jpg">
					</a>
				</div>
					<p>Это таблица со случайно расположенными объектами, служащие для проверки и развития быстроты нахождения этих объектов в определённом порядке. 
					Упражнения с таблицами позволяют улучшить периферическое зрительное восприятие, что важно, например, для скорочтения. 
					</p>
					<p>В этой интересной игре тебе нужно как можно быстрее найти все числа по порядку. 
					Очень важно использовать именно периферическое зрение: удерживай взгляд в только в центре таблицы!
					</p>
					<p><b>ВНИМАНИЕ</b> Результат записывается если не допущено ни одной ошибки и только в классическом режиме</p>

					<a href="tableShult" data-link="true" class="startGameButs">Начать игру</a>
			</div>`
		},
		results: {
			title: `Таблица результатов`,
			content: `<div id="bestResults">
			<div class="bestResultsHeader">
				<h2>Топ 10 лучших</h2>
			</div>
			<div id="bestResultsShult">
				<div class="resultHeader"><h3>Таблица Шульте</h3></div>
				<div class="resultColumnContainer">
					<div id="shult4x4" class="resultColumn">
						<h4 class="resultColumnH4">4 x 4</h4>
					</div>
					<div id="shult5x5" class="resultColumn">
						<h4 class="resultColumnH4">5 x 5</h4>
					</div>
					<div id="shult6x6" class="resultColumn">
						<h4 class="resultColumnH4">6 x 6</h4>
					</div>
					<div id="shult7x7" class="resultColumn">
						<h4 class="resultColumnH4">7 x 7</h4>
					</div>
					<div id="shult8x8" class="resultColumn">
						<h4 class="resultColumnH4">8 x 8</h4>
					</div>
				</div>
			</div>
			</div>`
		},
		contacts: {
			title: `Контакты`,
			content: `<div id="contactContainer">
			<h3>Обнаружили ошибки, напишите мне:</h3>
			<form id="my-form"
			  action="https://formspree.io/mnqzngpd"
			  method="POST">

			  <label><b>Ваше имя:</b></label>
			  <input type="text" name="name" id="userNameFeedback"/>

			  <label><b>Email:</b></label>
			  <input type="email" name="email" id="userEmailFeedback"/>

			  <label><b>Опишите проблему:</b></label>
			  <textarea name="message" id="userMessageFeedback"></textarea>

			  <button id="send">Submit</button>
			  <p id="my-form-status"></p>
			</form>
			<div id="resultSend"></div>
			</div>`
		},
		error: {
			title: `Ошибка`,
			content: `<p>Тут делать нечего, уходите.</p>`
		}
	},
	updateState: function(event) {
		event.preventDefault();
		event.stopPropagation();

		let page = event.target.getAttribute(`href`) || event.target.getAttribute(`data-but-href`) || event.target.getAttribute(`data-href`);

		let check = spaLogic.loadPage(page);

		if (check) {
			history.pushState({page: page}, null, spaLogic.host);
		}
	},
	loadPage: function(page) {
		if (page === spaLogic.state.page) {
			return false;
		}
		spaLogic.removeAdopt();
		stat.closeStat();

		if (page in spaLogic.content) {
			ui.mainContent.innerHTML = spaLogic.content[page].content;
			document.title = spaLogic.content[page].title;
			spaLogic.state.page = page;
			spaLogic.updateButtons();

			if (page === `results`) {
				firebaseApp.loadBestResults();
			} else if (page === `contacts`) {
				feedback.init();
			}
		} else if (page in spaLogic.gameContent) {
			ui.mainContent.innerHTML = spaLogic.gameContent[page].content;
			document.title = spaLogic.gameContent[page].title;
			spaLogic.state.page = page;
			spaLogic.updateButtons();

			if (page === `tableShult`) {
				tableShultModule.tableInit();
			} else if (page === `canvasReact`) {
				canvasReactModule.canvasReactInit();
			}
		} else {
			spaLogic.state.page = `error`;
			spaLogic.updateButtons();
			ui.mainContent.innerHTML = spaLogic.content[`error`].content;
			document.title = spaLogic.content[`error`].title;
		}
		return true;
	},
	updateButtons: function() {
    	let menuLinks = ui.navMenu.querySelectorAll('.buts');

    	for (let i = 0; i < menuLinks.length; i++) {
    		if (spaLogic.state.page === menuLinks[i].getAttribute('href') || spaLogic.state.page === ui.adoptMenu[i].getAttribute('href')) {
    			ui.adoptMenu[i].classList.add(`selectedButAdopt`);
				menuLinks[i].classList.add('selectedBut');
    		} else {
    			ui.adoptMenu[i].classList.remove(`selectedButAdopt`);
    			menuLinks[i].classList.remove('selectedBut');
    		}
    	}
    },
    popstate: function(event) {
    	let page = (event.state && event.state.page) || spaLogic.mainPage;
		spaLogic.loadPage(page);
    },
    menuHamburger: function() {
    	event.currentTarget.parentNode.classList.toggle('menu_state_open');
    },
    removeAdopt: function() {
    	document.getElementById(`menu`).classList.remove(`menu_state_open`);
    },
	init: function() {
		document.addEventListener('click', function(event) {
			if (event.target.getAttribute(`data-link`) === `true`) {
				spaLogic.updateState(event);
			}
		});
		window.addEventListener(`popstate`, spaLogic.popstate);
		document.getElementById(`hamburger`).addEventListener(`click`, spaLogic.menuHamburger);

		let page = location.hash.slice(1) || spaLogic.mainPage;
  		spaLogic.loadPage(page);
    }
};


const authLogic = {
	ui: {
		signBut: null,
		userName: null,
		userInput: null,
		nickname: null
	},	
	sessionId: null,
	userName: null,

	setSessionId: function() {
		const uuid =()=>'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
		.replace(/[xy]/g,(c, r) => ('x' == c ?(r = Math.random() * 16 | 0) : (r & 0x3 | 0x8))
			.toString(16));
		authLogic.sessionId = uuid();
		localStorage.setItem(`sessionId`, authLogic.sessionId);
	},

	saveUserName: function() {
		if (authLogic.ui.nickname) {
			authLogic.userName = authLogic.ui.nickname.innerText;
		} else if (authLogic.ui.userInput) {
			authLogic.userName = authLogic.ui.userInput.value;
		}
		authLogic.sendUserName();
	},

	sendUserName: function() {
		if (authLogic.userName) {
			authLogic.showName();
			firebaseApp.setUser(authLogic.userName, authLogic.sessionId);			
			authLogic.ui.signBut.innerHTML = `Выйти`;
			authLogic.ui.signBut.removeEventListener(`click`, authLogic.saveUserName);
			authLogic.ui.signBut.removeEventListener(`click`, authLogic.changeName);
			authLogic.ui.signBut.addEventListener(`click`, authLogic.signOut);
		}
	},

	signOut: function() {
		firebaseApp.signOutUser(authLogic.userName, authLogic.sessionId);
		authLogic.ui.signBut.innerHTML = `Войти`;
		authLogic.userName = null;
		authLogic.ui.userName.innerHTML = `Нажмите для входа`;
		authLogic.ui.signBut.removeEventListener(`click`, authLogic.signOut);
	},

	changeName: function(event) {
		if (event.target === authLogic.ui.userName) {
			authLogic.ui.userName.innerHTML = `<input type="text" id="userInput" placeholder="Введите имя">`;
			authLogic.ui.userInput = document.getElementById(`userInput`);
			userInput.focus();
			authLogic.ui.signBut.addEventListener(`click`, authLogic.saveUserName);
			userInput.addEventListener(`blur`, authLogic.showName);
		}
	},

	showName: function(event) {
		if (event && event.target.value) {
			authLogic.ui.userName.innerHTML = `<b id="nickname">${event.target.value}</b>`;
			authLogic.ui.nickname = document.getElementById(`nickname`);
		} else if (event) {
			authLogic.ui.userName.innerHTML = authLogic.userName || `Нажмите для входа`;
		} else {
			authLogic.ui.userName.innerHTML = authLogic.userName;
		}
	},

	init: function() {
		authLogic.ui.signBut = document.getElementById(`signIn`);
		authLogic.ui.userName = document.getElementById(`userName`);
		if (!!authLogic.ui.userName) {
			authLogic.ui.userName.addEventListener(`click`, authLogic.changeName);
		}
		if (!localStorage.getItem(`sessionId`)) {
			authLogic.setSessionId();
		} else {
			authLogic.sessionId = localStorage.getItem(`sessionId`);
		}
		firebaseApp.checkUser(authLogic.sessionId);
	}
}

const stat = {
	ui: {
		openStat: null,
		closeStat: null,
		statWindow: null,
		content: null
	},

	cvs: {
		width: null,
		height: null
	},
	resultsObj: null,

	openWindow: function() {
		if (authLogic.userName) {
			document.body.insertAdjacentHTML(`beforeend`, `<div id="statWindow"></div>`);
			stat.ui.statWindow = document.getElementById(`statWindow`);
			stat.ui.statWindow.innerHTML = `<h3>Статистика ${authLogic.userName}</h3>
			<img src="Res/Icons/close.png" id="closeStat" alt="close"/>
			<div id="statContent"></div>`;
			stat.ui.content = document.getElementById(`statContent`);
			stat.ui.closeStat = document.getElementById(`closeStat`);
			stat.ui.closeStat.addEventListener(`click`, stat.closeStat);
			firebaseApp.getAllResults(authLogic.userName);
		}
	},

	createCanvas: function() {		
		for (let i = 4; i < 9; i++) {
			stat.ui.content.insertAdjacentHTML(`beforeend`, `<canvas id="stat${i}x${i}"></canvas>`);
			let cvs = document.getElementById(`stat${i}x${i}`);
			cvs.setAttribute(`width`, `393`);
			cvs.setAttribute(`height`, `158`);
			let ctx = cvs.getContext(`2d`);
			stat.cvs.width = cvs.offsetWidth;
			stat.cvs.height = cvs.offsetHeight;
			ctx.fillRect(25, stat.cvs.height - 30, stat.cvs.width, 1.5);
			ctx.fillRect(25, stat.cvs.height - 30, 1.5, -stat.cvs.height);
			for (let i2 = 1; i2 < 10; i2++) {
				ctx.fillRect(24, ((stat.cvs.height - 30) / 10 * i2), 4.5, 1.5);
			}
			if (stat.resultsObj[`arr${i}x${i}`]) {
				for (let i3 = 1; i3 <= stat.resultsObj[`arr${i}x${i}`].length; i3++) {
					ctx.fillRect((stat.cvs.width - 8) / stat.resultsObj[`arr${i}x${i}`].length * i3, stat.cvs.height - 30, 1.5, -4.5);
				}
				stat.fillGraphic(`${i}x${i}`);
			}						
			stat.fillText(ctx ,`${i}x${i}`);
		}
	},

	fillText: function(ctx, size) {
		let percent = 110;
		for (let i = 0; i <= 10; i++) {
			ctx.textAlign = `center`;
			ctx.fillText(`${percent -= 10}%`, 12, ((stat.cvs.height - 30) / 9 * i));
		}
		ctx.fillText(`${size}`, 50, 15);
	},

	fillGraphic: function(size) {
		let goodTime;
		if (size === `4x4`) {
			goodTime = 350;
		} else if (size === `5x5`) {
			goodTime = 200;
		} else if (size === `6x6`) {
			goodTime = 50;
		} else if (size === `7x7`) {
			goodTime = 20;
		} else if (size === `8x8`) {
			goodTime = 12;
		}
		let tempArr = stat.resultsObj[`arr${size}`].slice();
		let ctx = document.getElementById(`stat${size}`).getContext(`2d`);
		ctx.beginPath();
		ctx.strokeStyle = `red`;
		ctx.moveTo(25,  stat.cvs.height - 30);
		for (let i = 0; i < stat.resultsObj[`arr${size}`].length; i++) {
			let x = (stat.cvs.width - 8) / stat.resultsObj[`arr${size}`].length,
				y = goodTime * +(`0.${stat.resultsObj[`arr${size}`][i].split(`:`).join(``)}`) * 10;
			ctx.lineTo(x * (i + 1), y);
			ctx.arc(x * (i + 1), y, 1.5, 0, Math.PI * 2, true);
			ctx.fillText(stat.resultsObj[`arr${size}`][i], x * (i + 1) - 30, y - 10);
		}
		ctx.stroke();
		ctx.closePath();
	},

	closeStat: function() {
		if (stat.ui.statWindow) {
			stat.ui.statWindow.remove();
		}
	},

	noInfo: function() {
		stat.ui.content.innerHTML = `<p>Вы не сыграли ни одной игры</p>`;
	},

	init: function() {
		stat.ui.openStat = document.getElementById(`statIcon`);
		stat.ui.openStat.addEventListener(`click`, stat.openWindow);
	}
}

window.addEventListener(`resize`, stat.adoptStat);
document.addEventListener('DOMContentLoaded', spaLogic.init);
document.addEventListener('DOMContentLoaded', authLogic.init);
document.addEventListener('DOMContentLoaded', stat.init);