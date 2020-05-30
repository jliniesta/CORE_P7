//El fichero controllers/quiz.js debe requerir el módulo 
//models (models/index.js) para poder acceder al modelo Quiz.
const {models} = require("../models"); //Requiere el fichero index que este dentro de models

/*Se debe definir y exportar el middleware index en el controlador 
controllers/quiz.js. Este middleware debe obtener todos los quizzes 
existentes en la base de datos usando findAll, y renderizar la vista 
views/quizzes/index.ejs con los quizzes obtenidos usando 
el método res.render. */
exports.index = async (req, res, next) => {
    try{
        const quizzes = await models.Quiz.findAll()
         //Promesa que me devuelve el array de todos los quizzes

        res.render("quizzes/index",  {quizzes});
        //El segundo parametro de render es todas las variables que yo quiero pasar a la vista
        //Sería {quizzes: quizzes}, como es la misma variable, se puede poner {quizzes}
    } catch(error){
        next(error);
    }

};