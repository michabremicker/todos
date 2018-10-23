const form = document.querySelector('form');
const errorElement = document.querySelector('.error-message');
const loadingElement = document.querySelector('.loading');
const todosElement = document.querySelector('.todos');
const API_URL = 'http://localhost:5000/todos';
const divs = [];

window.onunload = function(){ window.scrollTo(0,0); }

errorElement.style.display = 'none';

listAllTodos();

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');

	if (name.trim() && content.trim()) {
		errorElement.style.display = 'none';
		form.style.display = 'none';
		loadingElement.style.display = '';

		const todo = {
			name,
			content
		};

		fetch(API_URL, {
			method: 'POST',
			body: JSON.stringify(todo),
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			if(!response.ok) {
				const contentType = repsonse.headers.get('content-type');
				if (contentType.includes('json')) {
					return response.json().then(error => Promise.reject(error.message));
				} else {
					return response.text().then(message => Promise.reject(error.message));
				}
			}
		}).then(() => {
			form.reset();
			setTimeout(() => {
				form.style.display = '';
			}, 30000);
			listAllTodos();
		}).catch(errorMessage => {
			form.style.display = '';
			errorElement.textContent = errorMessage;
			errorElement.style.display = '';
			loadingElement.style.display = 'none';
		});
	} else {
		errorElement.textContent = 'Name and content are required!';
		errorElement.style.display = '';
	}
});

function listAllTodos() {
	todosElement.innerHTML = '';
	fetch(API_URL)
		.then(response => response.json())
		.then(todos => {
			todos.reverse();
			var i = 0;
			todos.forEach(todo => {
				const idtodo = todo._id;

				// create main container for todos
				const divmain = document.createElement('div');
				divmain.setAttribute("class","todos");
				divmain.setAttribute("id", "div"+i);
				divs[i] = "div"+i;

				// create todo
				const header = document.createElement('h5');
				header.textContent = todo.name;
				const contents = document.createElement('p');
				contents.textContent = todo.content;
				const date = document.createElement('small');
				date.textContent = todo.created;

				// checkbox
				const checkLabel = document.createElement('label');
				checkLabel.setAttribute("class", "containerdone");
				const check = document.createElement('input');
				check.type = 'checkbox';
				check.name = 'done'+i;
				check.id = 'done';
				const checkSpan = document.createElement('span');
				checkSpan.setAttribute("class", "checkmark");


				const doneName = check.name;
				const doneElement = document.querySelector("input[name="+doneName+"]");

				// build main div
				divmain.appendChild(header);
				divmain.appendChild(contents);
				divmain.appendChild(date);

				// append checkbox
				divmain.appendChild(checkLabel);
				checkLabel.appendChild(check);
				checkLabel.appendChild(checkSpan);

				todosElement.appendChild(divmain);

				if(todo.done === 1) {
					check.setAttribute("checked", "checked");
				}

				check.onclick = function() {
					if(this.checked) {
						var isdone = 1;
						if(todo.done === 1) {
							var isdone = 0;
						}
					} else {
						var isdone = 0;
					}
					console.log(doneName, idtodo, isdone);
					doneAPI(doneName, idtodo, isdone);
				}

				i++;
			});
			loadingElement.style.display = 'none';
			form.style.display = '';
		});
}

function isDoneable(doneName, idtodo, isdone) {

	console.log(doneElement);
	if (typeof doneElement != "undefined") {
		doneAPI(doneName, idtodo, isdone);
	} else {
		errorElement.textContent = 'Something went terribly wrong :(';
		errorElement.style.display = '';
	}

}

function doneAPI(doneName, idtodo, isdone) {
	errorElement.style.display = 'none';

	const done = {
		idtodo,
		isdone
	};
	fetch(API_URL + '/done', {
		method: 'POST',
		body: JSON.stringify(done),
		headers: {
			'content-type': 'application/json'
		}
	}).then(response => {
		if(!response.ok) {
			const contentType = repsonse.headers.get('content-type');
			if (contentType.includes('json')) {
				return response.json().then(error => Promise.reject(error.message));
			} else {
				return response.text().then(message => Promise.reject(error.message));
			}
		}
	});
}
console.log(divs);
// drag and drop for every div
/* todo: pos field in DB, drag and drop should be saved, also sort divs by pos, need to figure that out :)

var mousePosition;
var offset = [0,0];
var isDown = false;
for (i = 0; i < divs.length; i++) {
	document.getElementById(divs[i]).addEventListener('mousedown', function(e) {
		isDown = true;
		offset = [
			div.offsetTop - e.clientY
		];
	}, true);

	document.getElementById(divs[i]).addEventListener('mouseup', function() {
		isDown = false;
	}, true);

	document.getElementById(divs[i]).addEventListener('mousemove', function(event) {
		event.preventDefault();
		if (isDown) {
			mousePosition = {
				y : event.clientY
			};
			div.style.top = (mousePosition.y + offset[1]) + 'px';
		}
	}, true);
};
*/