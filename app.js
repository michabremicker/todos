var express = require('express');
var path = require('path');
var cors = require('cors');
var monk = require('monk');
var dateFormat = require('dateformat');

// db: todo, collection: todos | one: content, array: todos

// init app
var app = express();

// db connect
var db = monk(process.env.MONGO_URI || 'localhost/todo');
var todos = db.get('todos');

app.enable("trust proxy");
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		todo: 'not here...'
	});
});

app.get('/todos', (req, res, next) => {
	todos
		.find()
		.then(todos => {
			res.json(todos);
		}).catch(next);
});

function isValidTodo(todo) {
	return todo.name && todo.name.toString().trim() !== '' && todo.name.toString().trim().length <= 50&&
		   todo.content && todo.content.toString().trim() !== '' && todo.content.toString().trim().length <= 140; 
}

function isValidDone(done) {
	console.log(done.idtodo && done.idtodo.toString().trim() !== '' && done.idtodo.toString().trim().length <= 50&&
		   done.isdone == 0 || done.isdone == 1);
	return done.idtodo && done.idtodo.toString().trim() !== '' && done.idtodo.toString().trim().length <= 50&&
		   done.isdone == 0 || done.isdone == 1;
}

app.post('/todos', (req, res, next) => {
	if(isValidTodo(req.body)) {
		const todo = {
			name: req.body.name.toString().trim(),
			content: req.body.content.toString().trim(),
			created: dateFormat(new Date(), "dddd, dd.mmmm yyyy, HH:MM:ss"),
			done: 0
		};

		todos
			.insert(todo)
			.then(createdTodo => {
				res.json(createdTodo);
			}).catch(next);
	} else {
		res.status(422);
		res.json({
			content: 'input not valid :('
		});
	}
});
// todo is done for unique object
app.post('/todos/done', (req, res, next) => { 
	if(isValidDone(req.body)) {
		var id = req.body.idtodo;
		var isdone = req.body.isdone;
		console.log(id + ' ' + isdone);
		todos
			.update(
				{"_id": id},
				{$set: 
					{"done": isdone}
				},
				{ upsert: true }
			)
			.then(updatedTodo => {
				res.json(updatedTodo);
			}).catch(next);
	} else {
		res.status(422);
		res.json({
			content: 'input not valid :('
		});
	}
});

app.use((error, req, res, next) => {
	res.status(500);
	res.json({
		content: error.message
	});
});

app.listen(5000);

// start router
var router = require('./serv.js');

console.log(dateFormat(new Date(), "dddd, dd.mmmm yyyy, HH:MM:ss"));
console.log('app and server running and listening on 5000/8080');