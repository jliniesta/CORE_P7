var express = require('express');
var router = express.Router();

/*El método middleware debe desarrollarse en un fichero
controlador llamado controllers/quiz.js (debe crear el 
directorio controllers), y debe llamarse index. */
const quizController = require("../controllers/quiz"); //Controlador de los quizzes, y requiero el fichero
/*GET home page. */
router.get('/', function(req, res, next){
    res.render('index', {title: 'Express'});

});

/*GET /credits*/
router.get('/credits', function(req, res, next){
    res.render('credits');
});


/*El alumno debe editar el fichero routes/index.js para definir 
la ruta GET /quizzes. Use routes y su método get.
El primer parámetro es el path de la ruta, es decir, "/quizzes".*/

/*GET /quizzes*/
router.get('/quizzes', quizController.index);
 //El indice de todos los quizzes lo proporcciona un metodo index

module.exports = router;