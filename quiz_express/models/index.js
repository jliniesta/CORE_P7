const {Sequelize, Model, DataTypes} = require('sequelize'); //Se requerirá el paquete sequelize

const sequelize = new Sequelize("sqlite:quiz.sqlite"); //e creará una instancia de Sequelize que maneje la base de datos SQLite alojada en el fichero quiz.sqlite

class Quiz extends Model {}

Quiz.init( //se definirá el modelo Quiz con los campos question y answer
    {
        question: {
            type: DataTypes.STRING,
            unique: {msq: "Quiz already exists"}
        },
        answer: DataTypes.STRING
    },
    {sequelize}
);

module.exports = sequelize; //se exportará la instancia sequelize creada.

