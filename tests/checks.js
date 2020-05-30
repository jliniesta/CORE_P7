/* eslint-disable no-invalid-this*/
/* eslint-disable no-undef*/
// IMPORTS
const path = require("path");
const Utils = require("./testutils");
const util = require('util');
const exec = util.promisify(require("child_process").exec);
const spawn = require("child_process").spawn;
const fs = require("fs");

const path_assignment = path.resolve(path.join(__dirname, "../", "quiz_express"));

const URL = `file://${path_assignment.replace("%", "%25")}`;
const browser = new Browser({"waitDuration": 100, "silent": true});

var prueba = 1;
(prueba).should.not.be.undefined;

// CRITICAL ERRORS
let error_critical = null;


// Prechecks, no puntúan
describe("Prechecks", function () {
	it("1: Comprobando que existe la carpeta de la entrega...", async function () {
		this.name = "";
		this.score = 0;
		this.msg_ok = `Encontrada la carpeta'${path_assignment}'`;
		this.msg_err = `No se encontró la carpeta '${path_assignment}'`;
		const fileexists = await Utils.checkFileExists(path_assignment);

		if (!fileexists) {
			error_critical = this.msg_err;
		}
		fileexists.should.be.equal(true);
	});

	it(`2: Comprobar que se han añadido plantillas express-partials`, async function () {
		this.msg_ok = 'Se incluye layout.ejs';
		this.msg_err = 'No se ha encontrado views/layout.ejs';
		this.score = 0;
		fs.existsSync(path.join(path_assignment, "views", "layout.ejs")).should.be.equal(true);
	});

	it(`3: Comprobar que la migración y el seeder existen`, async function () {
		this.msg_ok = 'Se incluye la migración y el seeder';
		this.msg_err = "No se incluye la migración o el seeder";
		this.score = 0;

		let mig = fs.readdirSync(path.join(path_assignment, "migrations")).filter(fn => fn.endsWith('-CreateQuizzesTable.js'));
		this.msg_err = `No se ha encontrado la migración`;
		(mig.length).should.be.equal(1);
		let seed = fs.readdirSync(path.join(path_assignment, "seeders")).filter(fn => fn.endsWith('-FillQuizzesTable.js'));
		this.msg_err = 'No se ha encontrado el seeder';
		(seed.length).should.be.equal(1);
		// We could use a regex here to check the date
	});

	it(`4: Comprobar que los controladores existen`, async function () {
		this.msg_ok = 'Se incluye el controlador de quiz';
		this.msg_err = "No se incluye el controlador de quiz";
		this.score = 0;

		quiz = require(path.resolve(path.join(path_assignment, 'controllers', 'quiz')));
		quiz.index.should.not.be.undefined;
	})
});

describe("Comprobación de ficheros", function () {
	it(`5: Comprobar que las plantillas express-partials tienen los componentes adecuados`, async function () {
		this.msg_ok = 'Se incluyen todos los elementos necesarios en la plantilla';
		this.msg_err = 'No se ha encontrado todos los elementos necesarios';
		this.score = 1;
		let checks = {
			"layout.ejs": {
				true: [/<%- body %>/g, /<header>/, /<\/header>/, /<nav>/, /<\/nav>/, /<footer>/, /<\/footer>/]
			},
			"index.ejs": {
				true: [/<section>/, /<\/section>/],
				false: [/<header>/, /<\/header>/, /<nav>/, /<\/nav>/, /<footer>/, /<\/footer>/]
			},
			"credits.ejs": {
				true: [/<section>/, /<\/section>/]
			},
			[path.join("quizzes", "index.ejs")]: {
				true: [/<section>/, /<\/section>/, /<h2>[\t \r\n^M]*Lista de Quizzes[\t \r\n^M]*<\/h2>/g],
			}
		}

		for (fpath in checks) {
			let templ = fs.readFileSync(path.join(path_assignment, "views", fpath), "utf8");
			for(status in checks[fpath]) {
				elements = checks[fpath][status]
				for(var elem in elements){
					let e = elements[elem];
					if (status) {
						this.msg_err = `${fpath} no incluye ${e}`;
					} else {
						this.msg_err = `${fpath} incluye ${e}, pero debería haberse borrado`;
					}
					e.test(templ).should.be.equal((status == 'true'));
				}
			}
		}
	});

	it(`6: Comprobar que se ha añadido el código para incluir los comandos adecuados`, async function () {
		let rawdata = fs.readFileSync(path.join(path_assignment, 'package.json'));
		let pack = JSON.parse(rawdata);
		this.msg_ok = 'Se incluyen todos los scripts/comandos';
		this.msg_err = 'No se han encontrado todos los scripts';
		this.score = 1;
		scripts = {
			"super": "supervisor ./bin/www",
			"migrate": "sequelize db:migrate --url sqlite://$(pwd)/quiz.sqlite",  
			"seed": "sequelize db:seed:all --url sqlite://$(pwd)/quiz.sqlite",  
			"migrate_win": "sequelize db:migrate --url sqlite://%cd%/quiz.sqlite",  
			"seed_win": "sequelize db:seed:all --url sqlite://%cd%/quiz.sqlite"  ,
		}
		for(script in scripts){
			this.msg_err = `Falta el comando para ${script}`;
			pack.scripts[script].should.be.equal(scripts[script]);
		}
	})

});



describe("Pruebas funcionales", function () {
	var server;
	const db_file = path.join(path_assignment, '..', 'quiz.sqlite');
	before(async function() {
		// Crear base de datos nueva y poblarla antes de los tests funcionales. por defecto, el servidor coge quiz.sqlite del CWD
		fs.closeSync(fs.openSync(db_file, 'w'));

		let sequelize_cmd = path.join(path_assignment, "node_modules", ".bin", "sequelize")
		await exec(`${sequelize_cmd} db:migrate --url "sqlite://${db_file}" --migrations-path ${path.join(path_assignment, "migrations")}`)
		await exec(`${sequelize_cmd} db:seed:all --url "sqlite://${db_file}" --seeders-path ${path.join(path_assignment, "seeders")}`)


		server = spawn("node", [path.join(path_assignment, "bin", "www")]);
		await new Promise(resolve => setTimeout(resolve, 1000));
		browser.site = "http://localhost:3000/"
	});

	after(async function() {
		// Borrar base de datos
		await server.kill();
		fs.unlinkSync(db_file);
	})
	it("7: Comprobar que se puede importar el módulo...", async function () {
		this.score = 0;
		this.msg_ok = 'El módulo parece correcto';
		this.msg_err = 'No puede importarse el módulo de la aplicación';
	})
	var endpoints = [
		["/", 200],
		["/quizzes", 200],
		["/credits", 200],
		["/users", 404],
	];
	for (idx in endpoints) {
		let endpoint = endpoints[idx][0]
		let code = endpoints[idx][1]
		let num = 8 + parseInt(idx);
		it(`${num}: Comprobar que se resuelve una petición a ${endpoint} con código ${code}`, async function () {
			this.score = 1;
			this.name = "";
			this.msg_ok = 'Respuesta correcta';
			this.msg_err = 'No hubo respuesta';
			check = function(){
				browser.assert.status(code);
			}
			return browser.visit(endpoint)
			.then(check)
			.catch(check);
		})
	}
	it(`13: Comprobar que se muestran los quizzes`, async function () {
		this.score = 3;
		this.name = "";
		this.msg_ok = 'Quizzes encontrados';
		this.msg_err = 'No se encuentran todos los quizzes';
		let questions = [
			{question: "Capital de Italia", answer: "Roma"},
			{question: "Capital de Francia" , answer: "París"},
			{question: "Capital de España", answer: "Madrid"},
			{question: "Capital de Portugal", answer: "Lisboa"},
		]

		await browser.visit("/quizzes");
		browser.assert.status(200)

		res = browser.html();

		for (idx in questions) {
			let expect = `${questions[idx].question}: ${questions[idx].answer}`
			this.msg_err = `No se encuentra "${expect}" en los quizzes`;
			res.includes(expect).should.be.equal(true);
		}
	})

	it(`14: Comprobar que se muestra la foto`, async function () {
		this.score = 1;
		this.name = "";
		this.msg_ok = 'Foto incorporada';
		this.msg_err = 'No se encuentra la foto';

		await browser.visit("/credits");
		browser.assert.status(200);
		allcontent = browser.html();
		content = browser.html("img");
		content.includes("img src=").should.be.equal(true);
		content.includes("images/").should.be.equal(true);
	})
});

