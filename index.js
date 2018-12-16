// Requirements:
// A student manager app that is able to:
// - Show current student list 
// - Add new students 
// > Show all students;
// > Create a new student 
// > Save and Exit

var readlineSync = require('readline-sync');
var fs = require('fs');
var clear = require('clear');

var getData = function(){
	var data = fs.readFileSync('./data.json', { encoding : 'utf-8' });
	var objData = JSON.parse(data);
	return objData;
}

var main = function(data, name, alert){
	clear();

	console.log(name);
	if ( alert ){
		console.log(alert, '\n');
	}
	loadData(data);
	console.log('1. Go Home');
	console.log('2. Create new Student ');
	console.log('3. Searching');
	console.log('4. Delete at');
	console.log('5. Quit');
	var option = parseInt(readlineSync.question());

	switch ( option ) {
		case 1 : 
			main(getData(), 'Home');
			break;
		case 2 :
			create(getData());
			break;
		case 3 : 
			search(getData());
			break;
		case 4 :
			deleteAt(getData());
			break;
		default : return 0;
	}
}

var loadData = function(data){
	for ( var prop of data ){
		console.log('id :', prop.id , '| Name :', prop.name, '| Age :', prop.age, '\n');
	}
}

var create = function(data){
	clear();
	console.log('Create \n')
	var student = {};
	var id = 0;
	for ( var prop of data ){
		if ( id < prop.id ) {
			id = prop.id;
		}
	}
	student.id = id + 1;
	student.name = readlineSync.question('What is your name ? ');
	student.age = parseInt(readlineSync.question('What is your age ? '));
	data.push(student);
	newData = JSON.stringify(data, null, '\n');
	fs.writeFileSync('./data.json', newData);
	main(getData(), 'Create', 'Success');
}

var search = function(data){
	clear();
	console.log('Search \n')
	var key = readlineSync.question('Name ? ');
	var result = data.filter(function(input){
		return input.name === key;
	});
	if ( result[0] === undefined){
		main(result, 'Search', 'Undefined name');
	}
	main(result, 'Search', 'Success');
}

var deleteAt = function(data){
	clear();
	console.log('Delete at \n')
	if ( data[0] === undefined ) {
		main(getData(), 'Delete', 'Have not any students');
	}

	else {
		var check = false;
		var key = parseInt(readlineSync.question('Delete at id = '));
		var result = data.filter(function(id){
			if ( id.id === key ) {
				check = true;
				return id.id !== key;
			}
			else {
				return data; 
			} 
		})

		if ( check === false ) {
			main(getData(), 'Delete', 'Undefined ID');
		}

		else {
			var i = 0;
			for ( var prop of result ){
				prop.id = ++i;
			}
			var newData = JSON.stringify(result, null, '\n');
			fs.writeFileSync('./data.json', newData);
			main(getData(), 'Delete', 'Success');
		}
	}
}

main(getData(), 'Home');
