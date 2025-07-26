/*
	Автор: Сергей Авдеев (Kasito)
	Telegram: https://t.me/kasitoru
*/


// Обрабатываем события изменения полей ввода
document.querySelectorAll('input').forEach(function(elem) {
    elem.addEventListener('change', function(evnt) {
        if(evnt.target.checkValidity()) {
            evnt.target.closest('.group').classList.remove('required_error');
        }
    });
});

// Нажатие на кнопку проверки
['click', 'touchstart'].forEach(function(type) {
    document.querySelector('button[name="check"]').addEventListener(type, function(evnt) {
        const testing_form = document.querySelector('form[name="testing"]');
        if(testing_form.checkValidity()) {
            evnt.target.closest('#check_buttons').style.display = 'none';
            let results = [];
            let answers_list = testing_form.querySelectorAll('.group');
            answers_list.forEach(function(answer, index, array) {
                results[index] = true;
                answer.querySelectorAll('input').forEach(function(elem) {
                    results[index] = (checkInput(elem) === false ? false : results[index]);
                });
            });
            document.getElementById('results_text').textContent = 'Вы ответили правильно на ' + results.reduce((sum, a) => sum + a, 0) + ' вопросов из ' + answers_list.length;
            document.getElementById('results_text').style.display = 'block';
            window.scrollTo({top: 0, behavior: 'smooth'});
            setTimeout(function() {
                document.getElementById('reset_buttons').style.display = 'flex';
            }, 500);
        } else {
            [...testing_form.querySelectorAll('input')].reverse().forEach(function(elem) {
                if(!elem.checkValidity()) {
                    elem.closest('.group').classList.add('required_error');
                    elem.closest('.group').scrollIntoView({behavior: 'smooth'});
                }
            });
        }
    });
});

// Проверка одного вопроса
function checkInput(input) {
    resetInput(input, false);
    input.setAttribute('disabled', '');
    switch(input.getAttribute('type')) {
        case 'text':
            input.style.display = 'none';
            let userAnswer = input.value.toLowerCase();
            let rightAnswer = input.getAttribute('data-answer').toLowerCase();
            const textAnswer = document.createElement('p');
            textAnswer.className = 'text_answer';
            if(userAnswer == rightAnswer) {
                textAnswer.innerHTML = '<span>Ответ: <span class="inline-block !text-green-600 first-letter:uppercase">' + rightAnswer + '</span></span>';
            } else {
                textAnswer.innerHTML = '<span>Ваш ответ: <span class="inline-block !text-red-600 line-through first-letter:uppercase">' + userAnswer + '</span></span><br>Правильный ответ: <span class="inline-block !text-green-600 first-letter:uppercase">' + rightAnswer + '</span>';
            }
            input.closest('div').appendChild(textAnswer);
            return (userAnswer == rightAnswer);
            break;
        case 'radio':
            if(spans = input.closest('label').querySelectorAll('span')) {
                let label = spans[spans.length-1];
                let div = label.querySelector('div');
                if(input.getAttribute('data-answer') == 'true') {
                    if(div) {
                        div.classList.add('!border-green-600');
                    } else {
                        label.classList.add('!text-green-600');
                    }
                    return (input.checked ? true : null);
                } else if(input.checked) {
                    if(div) {
                        div.classList.add('!border-red-600');
                    } else {
                        label.classList.add('!text-red-600', 'line-through');
                    }
                    return false;
                }
            }
            break;
    }
    return null;
}

// Сброс одного вопроса
function resetInput(input, clear) {
    input.removeAttribute('disabled');
    switch(input.getAttribute('type')) {
        case 'text':
            if(clear) { input.value = ''; }
            input.style.display = 'inline-block';
            const textAnswer = input.closest('div').querySelector('.text_answer');
            if(textAnswer) { textAnswer.remove(); }
            break;
        case 'radio':
            if(clear) { input.checked = false; }
            if(spans = input.closest('label').querySelectorAll('span')) {
                let label = spans[spans.length-1];
                let div = label.querySelector('div');
                if(div) {
                    div.classList.remove('!border-green-600', '!border-red-600');
                } else {
                    label.classList.remove('!text-green-600', '!text-red-600', 'line-through');
                }
            }
            break;
    }
}

// Сброс всей формы
function resetForm() {
    document.querySelectorAll('input').forEach(function(elem) {
        resetInput(elem, true);
    });
    document.getElementById('results_text').textContent = '';
    document.getElementById('results_text').style.display = 'none';
    document.getElementById('check_buttons').style.display = 'flex';
    document.getElementById('reset_buttons').style.display = 'none';
    document.getElementById('reset_buttons').disabled = true;
    window.scrollTo({top: 0, behavior: 'smooth'});
    return false;
}
