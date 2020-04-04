;let tableShultModule = (function() {
	function tableLogic() {
		let cellAmount = null,
			field = null,
			tableShultHead = null,
			tableShultBody = null,
			musicBut = null,
			numArr = null,
			shuffledArr = [],
			count = 0,
			wrongClicks = 0,
			interval = null,
			audioObj = null,
			result = null,
			colorMode = false,
			colorsList = [
			`#008c36`,`#FF0000`,`#C71585`,`#FF7F50`, `#FFFF00`,
			`#EE82EE`, `#800080`, `#D2691E`, `#20B2AA`, `#ADFF2F`, 
			`#2F4F4F`, `#AFEEEE`, `#0000CD`
			],
			rotateMode = false,
			resizeTimer = null,
			that = this;

		this.saveDifficult = function(tableShultSize) {
			cellAmount = +(tableShultSize);

			this.generateTable();
			this.arrCreate();
		}

		this.generateTable = function() {
			field.innerHTML = `
			<table id="tableShultMainTable" class="unselectable">
				<thead id="tableShultHead"></thead>
				<tbody id="tableShultBody"></tbody>
			<table>`;

			let tableShultMainTable = document.getElementById(`tableShultMainTable`);
			tableShultHead = tableShultMainTable.querySelector(`#tableShultHead`);
			tableShultBody = tableShultMainTable.querySelector(`#tableShultBody`);
		}

		this.fillTableHead = function() {			
			tableShultHead.innerHTML = `
				<tr>
					<th id="numberToFind">Найдите цифру: 1</th>
					<th id="timer">Время: 0:00:0</th>
					<th id="headThBut"><a id="music"><img src="Res/Icons/Sound-true.png" alt="Муз"></a><a id="restartShultBut"><img src="Res/Icons/reset-button-icon.png" alt="Рес"></a></th>
				</tr>
			`;
			document.getElementById(`numberToFind`).setAttribute(`colspan`, Math.round(cellAmount / 2));
			document.getElementById(`timer`).setAttribute(`colspan`, Math.floor(cellAmount / 2 - 1));
			document.getElementById(`restartShultBut`).addEventListener(`click`, that.restartGame);
			musicBut = document.getElementById(`music`);
			musicBut.addEventListener(`click`, that.playMusic, {once: true});

			this.fillTableBody();
		}

		this.fillTableBody = function() {
			let indexForArr = 0;

			for (let i = 0; i < cellAmount; i++) {
				tableShultBody.insertAdjacentHTML(`beforeend`, `<tr id="row${i}"></tr>`);
				for (let i2 = 0; i2 < cellAmount; i2++) {

					if (rotateMode && this.sixNineCheck(shuffledArr[indexForArr].toString().split()[0]) && this.sixNineCheck(shuffledArr[indexForArr].toString().split()[0])) {
						document.getElementById(`row${i}`).insertAdjacentHTML(`beforeend`, `<td data-cell-index="${indexForArr}"><div>${shuffledArr[indexForArr]}.</div></td>`);
					} else {
						document.getElementById(`row${i}`).insertAdjacentHTML(`beforeend`, `<td data-cell-index="${indexForArr}"><div>${shuffledArr[indexForArr]}</div></td>`);
					}

					let tableCell = document.querySelector(`[data-cell-index="${indexForArr}"]`);
					tableCell.style.width = `${that.countSizes()}px`;
					if (colorMode) {
						tableCell.style.backgroundColor = this.returnRandomColor();
						tableCell.style.color = this.returnRandomColor();
						while (tableCell.style.backgroundColor === tableCell.style.color) {
							tableCell.style.color = this.returnRandomColor();
						}
					} else if (rotateMode) {
						this.rotateCell(tableCell.querySelector(`div`), 5);
					}

					indexForArr++;									
				}
			}
			tableShultBody.addEventListener(`click`, this.clickListener);
			this.stopWatch();
		}

		this.clickListener = function(event) {
			let target = null,
				wrongTarget = null;

			if (event.target.tagName === `TD` && that.checkNum(event.target) === true) {
				target = event.target;
			} else if (event.target.parentNode.tagName === `TD` && event.target.tagName === `DIV` && that.checkNum(event.target.parentNode) === true) {
				target = event.target.parentNode;
			} else if (event.target.tagName === `TD`) {
				wrongTarget = event.target;
			} else if (event.target.tagName === `DIV` && event.target.parentNode.tagName === `TD`) {
				wrongTarget = event.target.parentNode;
			}

			if (target) {
				if (count + 1 === cellAmount * cellAmount) {
					that.gameEndMusic();
					document.getElementById(`numberToFind`).innerHTML = `Все числа найдены`;
					count++;
					that.stopWatch(true);
				} else {
					that.trueClickMusic();
					if (rotateMode) {
						that.rotateTurn(7);
					}
					let animIdtrue,
						animIdtrue2,
						scale = 9;
					clearInterval(animIdtrue);
					clearInterval(animIdtrue2);

					animIdtrue = setInterval(function() {
						target.style.transform = `scale(0.9${scale -=1.5}, 0.9${scale}`;
						tableShultBody.style.backgroundColor = `rgba(201, 237, 190, 1)`;
						if (scale === 0) {
							clearInterval(animIdtrue);
							animIdtrue2 = setInterval(function() {
								target.style.transform = `scale(0.9${scale +=1.5}, 0.9${scale}`;
								if (scale === 6) {
									target.style.transform = ``;
									clearInterval(animIdtrue2);
								}
							}, 16);
						}
					}, 16);
					
					document.getElementById(`numberToFind`).innerHTML = `Найдите цифру: ${++count + 1}`;
				}
			} else if(wrongTarget) {
				that.wrongClickMusic();
				tableShultBody.style.backgroundColor = `rgba(250, 90, 90, 0.25)`;
				let animId,
					animId2,
					animId3,
					rotateRad = 0;
				clearInterval(animId);
				clearInterval(animId2);
				clearInterval(animId3);

				animId = setInterval(function() {
					if (rotateRad <= 5) {
						wrongTarget.style.transform = `rotate(${rotateRad += 1.2}deg)`;							
					} else {
						clearInterval(animId);
						animId2 = setInterval(function() {
							if (rotateRad >= -5) {
								wrongTarget.style.transform = `rotate(${rotateRad -= 1.2}deg)`;							
							} else {
								clearInterval(animId2);
								animId3 = setInterval(function() {
									wrongTarget.style.transform = `rotate(${rotateRad += 1.2}deg)`;
									if (rotateRad >= 0) {
										wrongTarget.style.transform = ``;
										clearInterval(animId3);
									}
								}, 16);
							}
						}, 16);
					}
				}, 16);
				wrongClicks++;
			}
		}

		this.rotateTurn = function(speed) {
			for (let i = 0; i < tableShultBody.querySelectorAll(`td div`).length; i++) {
				this.rotateCell(tableShultBody.querySelectorAll(`td div`)[i], speed);
			}
		}

		this.rotateCell = function(target, speed) {
			let random = Math.random(),
				rotateGrad = 0,
				rotateEnd = that.returnRotateEnd(random);

			let rotateAnim = setInterval(function() {
				if (rotateGrad >= rotateEnd) {
					target.style.transform = `rotate(${rotateEnd}deg)`;
					clearInterval(rotateAnim);
					return;
				}
				target.style.transform = `rotate(${rotateGrad += speed}deg)`;
			}, 16)
		}

		this.sixNineCheck = (number) => number === `6` ? true : (number === `9`? true : false);

		this.returnRotateEnd = (random) => random <= 0.5 ? (random <= 0.25 ? 0 : 90) : (random <= 0.75 ? 180 : 270);

		this.checkNum = (target) => (shuffledArr[target.getAttribute(`data-cell-index`)] === numArr[count]) ? true : false;

		this.countSizes = () => Math.round(tableShultBody.offsetWidth / cellAmount);

		this.returnRandomColor = () => colorsList[Math.floor(Math.random() * colorsList.length)];

		this.arrCreate = function() {
			numArr = [].map.call('1'.repeat(cellAmount * cellAmount), (a, i) => i + 1);
			shuffledArr = this.shuffleArr(numArr.slice());

			this.fillTableHead();
		}


		this.shuffleArr = function(arr) {
			for(let i = 0; i < arr.length; i++){
				let j = Math.floor(Math.random() * i);
				let temp = arr[j];
				arr[j] = arr[i];
				arr[i] = temp;
			}
			return arr;
		}
		//////Music Block
		this.playMusic = function() {
			musicBut.querySelector(`img`).src = `Res/Icons/Sound-none.png`;
			musicBut.addEventListener(`click`, that.stopMusic, {once:true});
			audioObj = new Audio();
			audioObj.volume = 0.04;
			audioObj.preload = 'auto';
			audioObj.src = 'Res/sounds/ExploringNeptune.mp3';
			audioObj.play();
		}

		this.stopMusic = function() {
			if (musicBut) {				
				musicBut.querySelector(`img`).src = `Res/Icons/Sound-true.png`;
				musicBut.addEventListener(`click`, that.playMusic, {once:true});	
			}
			if (audioObj) {
				audioObj.pause();
			}
		}

		this.trueClickMusic = function() {
			let audioObjTrue = new Audio();
			audioObjTrue.volume = 0.2;
			audioObjTrue.preload = 'auto';
			audioObjTrue.src = 'Res/sounds/trueClick.mp3';
			audioObjTrue.play();
		}

		this.wrongClickMusic = function() {
			let audioObjWrong = new Audio();
			audioObjWrong.volume = 0.2;
			audioObjWrong.preload = 'auto';
			audioObjWrong.src = 'Res/sounds/wrongClick.mp3';
			audioObjWrong.play();
		}

		this.gameEndMusic = function() {
			let audioObjEnd = new Audio();
			audioObjEnd.volume = 0.1;
			audioObjEnd.preload = 'auto';
			audioObjEnd.src = 'Res/sounds/gameEnd.mp3';
			audioObjEnd.play();
		}
		//////
		this.stopWatch = function(stop) {
			if (stop) {
				clearInterval(interval);
				that.endGame();
				return;
			}
			let milsec = 0,
				sec = 0,
				min = 0;

			interval = setInterval(function() {
				milsec++
				if (milsec === 10) {
					milsec = 0;
					sec++;
				}
				if (sec === 60) {
					sec = 0;
					min++;
				}
				if (sec >= 0 && sec <= 9) {
					document.getElementById(`timer`).innerHTML = `Время: ${min}:0${sec}:${milsec}`;
					result = `${min}:0${sec}:${milsec}`;
				} else {
					document.getElementById(`timer`).innerHTML = `Время: ${min}:${sec}:${milsec}`;
					result = `${min}:${sec}:${milsec}`;
				}
			}, 100);
		}

		this.endGame = function() {
			field.insertAdjacentHTML(`beforeend`, `<div id="resultTable" class="additContainer"></div>`);
			let resultTable = document.getElementById(`resultTable`);
			resultTable.innerHTML = `
			<h3>Результат</h3>
			</hr>
			<div>Таблица <b>${cellAmount}x${cellAmount}</b></div>
			<div>Ваш результат <b>${result}</b></div>
			<div>Количество ошибок: <b>${wrongClicks}</b></div>
			<button id="restartGameBut" class="additBut">Начать заново</button>`;
			if (authLogic.userName && !colorMode && !rotateMode && wrongClicks === 0) {
				firebaseApp.shultSaveRes(authLogic.userName, result, `${cellAmount}`);
				firebaseApp.getArrRes(authLogic.userName, result, `${cellAmount}x${cellAmount}`);
			}
			document.getElementById(`restartGameBut`).addEventListener(`click`, that.restartGame);
		}

		this.difficultShultHide = function() {
			if (!!document.getElementById(`difficultShult`)) {
				document.getElementById(`difficultShult`).remove();
			}
		}

		this.resultTableHide = function() {			
			if (!!document.getElementById(`resultTable`)) {
				document.getElementById(`resultTable`).remove();
			}
		}

		this.clearAll = function() {
			that.difficultShultHide();
			that.resultTableHide();
			that.reset();
			that.stopMusic();
		}

		this.restartGame = function() {
			that.clearAll();
			that.reset();
			that.difficultShult();
		}

		this.reset = function() {
			that.stopMusic();
			count = 0;
			wrongClicks = 0;
			rotateMode = false;
			colorMode = false;
			clearInterval(interval);
		}

		this.difficultShult = function(event) {
			if (!!event) {
				event.preventDefault();
			}
			field.insertAdjacentHTML(`beforeend`, `<div id="difficultShult" class="additContainer"></div>`);
			let difficultShult = document.getElementById(`difficultShult`);
			difficultShult.innerHTML = `
			<h3>Выберите сложность</h3>
			</hr>
			<label for='tableShultSize'>Размер таблицы:</label>
				<select id='tableShultSize'>
					<option value='4'>4 x 4</option>
					<option value='5'>5 x 5</option>
					<option value='6'>6 x 6</option>
					<option value='7'>7 x 7</option>
					<option value='8'>8 x 8</option>
				</select>
			<div>Цветовое безумие: <input id="colorMode" type="checkbox"></div>
			<div>Бешеный круговорот: <input id="rotateMode" type="checkbox"></div>				
			<button id="startTableBut" class="additBut">Начать игру</button>`;

			let tableShultSize = document.getElementById(`tableShultSize`);
			let startTableBut = document.getElementById(`startTableBut`);

			startTableBut.addEventListener(`click`, function() {
				colorMode = document.getElementById(`colorMode`).checked;
				rotateMode = document.getElementById(`rotateMode`).checked;
				that.saveDifficult(tableShultSize.value);
				that.difficultShultHide();
			});
		}

		this.resize = function() {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout(function() {
				that.sizeChange();
			}, 1000);
		}

		this.sizeChange = function() {
			let mainWidth = document.getElementById(`mainContent`).offsetWidth,
				mainHeight = document.getElementById(`mainContent`).offsetHeight,
				setWidth = mainWidth - 30,
				setHeight = (mainHeight - 5 - 65) / 1.5;

			if (mainWidth < 610) {
				field.style.width = `${setWidth}px`;				
				field.style.top = `${mainWidth / 2 + mainWidth * 0.02}px`;
				if (field.offsetWidth + 20 < field.offsetHeight) {
					field.style.height = `${setWidth}px`;
				} else if (field.offsetWidth + 20 > field.offsetHeight) {
					field.style.height = `${setWidth - 20}px`;
				}
			} else if (mainHeight < 875) {
				field.style.height = `${setHeight}px`;				
				field.style.top = `${setHeight / 2 + setHeight * 0.025}px`;
				if (field.offsetWidth + 20 < field.offsetHeight) {
					field.style.width = `${setHeight}px`;
				} else if (field.offsetWidth + 20 > field.offsetHeight) {
					field.style.width = `${setHeight - 20}px`;
				}
			} else {
				field.style.width = ``;
				field.style.height = ``;
				field.style.top = ``;
			}
		}

		this.init = function() {
			field = document.getElementById(`tableShultContainer`);
			that.sizeChange();
			window.addEventListener(`popstate`, that.reset);
			window.addEventListener(`resize`, that.resize);
			ui.navMenu.addEventListener(`click`, function() {
				if (event.target.getAttribute(`data-link`) === `true`) {
					that.reset();
				}
			});
			this.difficultShult();
		}
	}

	return {
		tableInit: function() {				
			const appTableLogic = new tableLogic();
			appTableLogic.init();
		}
	};
})();