const feedback = {
	ui: {
		feedbackForm: null,
		formName: null,
		formEmail: null,
		formMessage: null,
		formAfter: null,
		submit: null
	},

	checkForms: function(event) {
		event.preventDefault();

		if (feedback.ui.formEmail.value && feedback.ui.formMessage.value) {
			let data = new FormData(feedback.ui.feedbackForm);
			feedback.ajax(feedback.ui.feedbackForm.method, feedback.ui.feedbackForm.action, data, feedback.success, feedback.error);
		} else {
			feedback.ui.formAfter.innerHTML = `Проверьте введёные данные`;
		}
	},

	ajax: function(method, url, data, success, error) {
	    let xhr = new XMLHttpRequest();
	    xhr.open(method, url);
	    xhr.setRequestHeader("Accept", "application/json");
	    xhr.onreadystatechange = function() {
	    	if (xhr.readyState !== XMLHttpRequest.DONE) return;
	    	if (xhr.status === 200) {
	        	feedback.success(xhr.response, xhr.responseType);
	    	} else {
	    		feedback.error(xhr.status, xhr.response, xhr.responseType)
	   		}
	    };
	    xhr.send(data);
	},

	success: function() {
      feedback.reset();
      feedback.ui.formAfter.innerHTML = `Сообщение отправлено. Спасибо`;
    },

    error: function(status, response, responseType) {
    	feedback.ui.formAfter.innerHTML = `Неудача, попробуйте снова. Спасибо`;
	},

    reset: function() {
    	feedback.ui.formName.value = ``;
    	feedback.ui.formEmail.value = ``;
    	feedback.ui.formMessage.value = ``;
    },

	init: function() {
		feedback.ui.feedbackForm = document.getElementById(`my-form`);
		feedback.ui.formEmail = document.getElementById(`userEmailFeedback`);
		feedback.ui.formName = document.getElementById(`userNameFeedback`);
		feedback.ui.formMessage = document.getElementById(`userMessageFeedback`);
		feedback.ui.formAfter = document.getElementById(`resultSend`);
		feedback.ui.submit = document.getElementById(`send`);
		feedback.ui.submit.addEventListener(`click`, feedback.checkForms);
	}
}