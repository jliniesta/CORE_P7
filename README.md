
<img  align="left" width="150" style="float: left;" src="https://www.upm.es/sfs/Rectorado/Gabinete%20del%20Rector/Logos/UPM/CEI/LOGOTIPO%20leyenda%20color%20JPG%20p.png">
<img  align="right" width="60" style="float: right;" src="http://www.dit.upm.es/figures/logos/ditupm-big.gif">

<br/><br/><br/>

# Entrega 7: Quiz Express 

Versión: 19 de Marzo de 2020

## Objetivos
* Afianzar los conocimientos obtenidos sobre el uso de Express para desarrollar servidores web.
* Entender el uso de express-generator, así como del esqueleto y de la estructura de directorios generada para albergar una aplicación basada en node y express.
* Aprender a completar en el esqueleto una aplicación de servidor basada en MVC (Modelo-Vista-Controlador) con vistas parciales EJS.

## Descripción de la práctica

En esta práctica se desarrollará un servidor web con el siguiente interfaz REST: 

```
GET /         // muestra la página home de bienvenida.
GET /credits  // muestra la página de créditos con el nombre, la foto y cv del autor.
GET /quizzes  // muestra un listado con todos los quizzes almacenados en la BBDD. 
```

El esqueleto inicial del servidor web se generará con el paquete **express-generator**. Este esqueleto se adaptará para atender las primitivas anteriores. Se seguirá el patrón MVC, creando los modelos, controladores, rutas y vistas necesarios.

Para el modelo se creará una base de datos **SQLite** a la que se accederá usando el ORM **Sequelize**. La base de datos tendrá una tabla llamada **Quizzes** que se inicializará con los siguientes quizzes: 

```
[ { question: "Capital de Italia",   answer: "Roma" },  
  { question: "Capital de Francia",  answer: "París"},
  { question: "Capital de España",   answer: "Madrid"},
  { question: "Capital de Portugal", answer: "Lisboa"}
] 
```

Para las vistas se usarán plantillas **EJS**. Se usará el paquete **express-partials** para añadir soporte de vistas parciales y poder definir un marco común de aplicación (**layout.ejs**) para todas las vistas. El acceso a cada una de las vistas se hará usando una barra de navegación en el marco de la aplicación.

## Descargar el código del proyecto

Es necesario utilizar la **versión 12 de Node.js** para el desarrollo de esta práctica. El proyecto debe clonarse en el ordenador en el que se está trabajando:

```
$ git clone https://github.com/CORE-2020/Entrega7_quizexpress
```

A continuación se debe acceder al directorio de trabajo, e instalar todas las dependencias.

```
$ cd Entrega7_quizexpress
$ npm install
```

## Tareas

### Tarea 1 - Crear el esqueleto de la aplicación

El proyecto clonado solo contiene los ficheros necesarios para ejecutar el autocorrector. El alumno debe crear un subdirectorio nuevo en el que desarrollará la practica. Debe usar el paquete **express-generator** para crear ese subdirectorio de trabajo con el esqueleto inicial de la práctica.

Primero hay que instalar el paquete **express-generator**. Para ello, el alumno debe ejecutar:

```
$ npm install express-generator
```

Este paquete proporciona un programa llamado **express** que sirve para crear el esqueleto inicial de una aplicación web, es decir, los ficheros que implementan una version inicial del servidor.

Para crear estel esqueleto inicial, el alumno debe ejecutar el comando:

```
$ npx express --view=ejs quiz_express
```

Este comando crea el subdirectorio **quiz_express** con los ficheros del esqueleto inicial de la práctica. 

Para arrancar y probar el servidor, primero hay que cambiarse al directorio **quiz_express** e instalar los paquetes de los que depende.

```
$ cd quiz_express
$ npm install
```

Ahora el servidor puede lanzarse ejecutando el comando:

```
$ npm start
```

**start** es un script definido en **package.json** para que ejecute **"node bin/www"** (nota: El servidor también podría lanzarse ejecutando directamente este comando).

El servidor lanzado atiende las peticiones en el puerto **3000**. Hay que ejecutar un navegador (Chrome, Firefox, Safari, ...) y conectarse a la URL **http://localhost:3000**. El navegador mostrará la página principal que ofrece el servidor que hemos creado.

### Tarea 2 - Limpiar el esqueleto

El esqueleto generado por **express** tiene algunos elementos que no queremos usar, por lo que vamos a hacer limpieza. Concretamente vamos a eliminar el recurso **user** creado por el esqueleto. Este recurso podría ser el paso inicial para completar un servicio de gestión de usuarios.

* Eliminar las rutas de user: El esqueleto creó el fichero **routes/users.js** con las definiciones de las rutas de usuarios. El alumno de borrar este fichero.
* El fichero **routes/users.js** se carga y usa en **app.js**. El alumno debe buscar y eliminar las referencias a **routes/users.js**. Son las siguientes sentencias de app.js:

```
var usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### Tarea 3 - Instalar supervisor

Cada vez que se modifica algún fichero (javascript) de nuestro proyecto, hay que detener el servidor y relanzarlo para los nuevos cambios se apliquen. Para no tener que hacer este proceso manualmente, pueden instalarse programas que lo hacen automáticamente por nosotros (**forever**, **supervisor**, ...). Estos programa vigilan los ficheros de nuestra aplicación, y si detectan que hay cambios, detienen la aplicación y la relanzan de nuevo.

El alumno debe usar **supervisor**. Para instalarlo debe ejecutar el siguiente comando en el terminal estando en el directorio `quiz_express`

```
$ npm install supervisor
```

(Nota: También se puede instalar de forma global usando **sudo** y **-g**.)

Para usar **supervisor**, el servidor se debe lanzar ejecutando el comando "**npx supervisor bin/www**". Por razones de comodidad, se puede añadir un script en **package.json**. 

El alumno debe modificar la sección **scripts** de **package.json** (del directorio `quiz_express`) para que quede así:

```
  "scripts": {
    "start": "node ./bin/www",
    "super": "supervisor ./bin/www"
  }
```

Se ha añadido el script **super** para lanzar el servidor usando **supervisor**. El comando para ejecutar el script que lanza el servidor usando **supervisor** es:

```
$ npm run super
```

### Tarea 4 - Crear el marco de aplicación

El paquete **express-partials** se usa en aplicaciones **Express** para soportar vistas parciales y añadir un marco de aplicación común. En esta práctica solo usaremos el marco de aplicación común. El marco de aplicación proporciona la página HTML que se usará para mostrar cualquiera de las vistas del servidor.

El paquete **express-partials** proporciona un middleware que modifica el método **res.render** proporcionado por **Express**. Por defecto, la nueva versión de **res.render** inyecta las vistas EJS a mostrar dentro del fichero **views/layout.ejs**, que es el fichero que implementa el marco de aplicación. El marco tiene una sentencia **\<%- body %\>** que es donde se inserta la vista a mostrar.

El alumno debe instalar este paquete ejecutando:

```
$ npm install express-partials
```

En la documentación del paquete se detalla cómo debe instalarse. En **app.js** hay que requerir el paquete y usar **app.use** para instalar el middleware que proporciona.

```
...
var logger = require('morgan');
var partials = require('express-partials');    \<--- Añadir

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());           \<--- Añadir

app.use('/', indexRouter);
...
```

El alumno debe crear el fichero **views/layout.ejs** conteniendo el marco de aplicación. Es la página HTML5 que se enviará al cliente (el navegador) para todas las peticiones que realice. Esta página debe utilizar las marcas de HTML5 habituales: 

- **\<header\>**: cabecera donde se suele incluir el nombre del portal.
- **\<nav\>**: barra de navegación con los botones para solicitar las vista que se desea ver.
- **\<footer\>**: pié de página.

El fichero **views/layout.ejs** debe incluir la sentencia **\<%- body %\>** en el punto donde se va a insertar la vista a mostrar (el método **res.render** asigna el código HTML de la vista a la variable **body**).

Finalmente, el alumno debe retocar la vista **views/index.ejs** que implementa la vista home para que se integre correctamente con el marco **views/layout.ejs**, usando un elemento HTML de tipo **\<section\>**. Elimine de **views/index.ejs** todos los elementos HTML que ya proporciona **views/layout.ejs**, y cree una sección **\<section\>** que contenga solo el contenido específico de esta vista (el encabezado y el párrafo de bienvenida).

### Tarea 5 - Crear los elementos MVC de la primitiva GET /credits. 

El alumno debe modificar el fichero **routes/index.js** para añadir la nueva ruta para **GET /credits**.

La definición de esta ruta es muy parecida a la definición de **GET /**.
Use **router** con su método **get**. El primer parámetro es el path de la ruta, es decir, **"/credits"**. El segundo parámetro es una función middleware que debe renderizar la vista con los créditos.

La vista con los créditos se debe implementar en el fichero **views/credits.ejs**. Es un fichero **EJS**. Debe contener un elemento HTML de tipo **\<section\>**. Esta vista debe mostrar el título de la página, el nombre del autor de la práctica, su foto y un breve texto sobre el autor y el portal (puede ser ficticio).

La fotografía del autor que muestra en esta vista debe incluirse en el directorio de imágenes **public/images**. Puede ser ficticia. 

Para probar este desarrollo, el alumno puede conectarse con el navegador a la URL **http://localhost:3000/credits**. Debe mostrar la vista de créditos dentro del marco de aplicación.

### Tarea 6 - Crear los elementos MVC de la primitiva GET /quizzes. 

Esta primitiva se usa para obtener un listado de todos los quizzes almacenados en la base de datos.

#### El Modelo:

Empecemos con el desarrollo del modelo, es decir, la base de datos y el acceso a ella. Se debe crear una base de datos **SQLite** a la que se accederá usando **Sequelize**. Por tanto, el alumno necesita instalar los paquetes **sqlite3**, **sequelize** y **sequelize-cli**:

```
$ npm install sqlite3 sequelize sequelize-cli
```

El alumno debe crear el fichero **models/index.js** para configurar **Sequelize** y definir el modelo **Quiz**. 

El contenido del fichero **models/index.js** es muy parecido al realizado en la entrega 5 de bases de datos. Se requerirá el paquete **sequelize**, se creará una instancia de **Sequelize** que maneje la base de datos **SQLite** alojada en el fichero **quiz.sqlite**, se definirá el modelo **Quiz** con los campos **question** y **answer**, y se exportará la instancia **sequelize** creada.

El alumno también debe crear una migración que cree la tabla **Quizzes** en la base de datos. Esta migración será muy parecida a la desarrollada en la entrega 5 de bases de datos, pero excluyendo el campo **authorId**. El fichero de migración a crear debe llamarse **migrations/YYYYMMDDhhmmss-CreateQuizzesTable.js**, donde YYYYMMDDhhmmss es la fecha en la que se creo el fichero. Para crear este fichero puede usar el comando:

```
npx sequelize migration:create --name  CreateQuizzesTable
```

El alumno también debe crear un fichero seeder que añada los quizzes iniciales descritos al principio de este documento a la tabla Quizzes. Este fichero seeder es muy parecido al desarrollado en la entrega 5 de bases de datos, pero excluyendo el campo **authorId**. Recuerde que se deben crear los campos **id**, **question**, **answer**, **createdAt** y **updatedAt**.

```
question: "Capital de Italia"   - answer: "Roma"  
question: "Capital de Francia"  - answer: "París"  
question: "Capital de España"   - answer: "Madrid"  
question: "Capital de Portugal" - answer: "Lisboa"
```

El fichero seeder a crear debe llamarse **seeders/YYYYMMDDhhmmss-FillQuizzesTable.js**, donde YYYYMMDDhhmmss es la fecha en la que se creo el fichero. Para crear este fichero puede usar el comando:

```
npx sequelize seed:generate --name FillQuizzesTable
```

El alumno debe crear en **package.json** (dentro del directorio `quiz_express`) los siguientes scripts para aplicar la migración y el seeder (hay versiones para unix y para windows):

```
  "migrate": "sequelize db:migrate --url sqlite://$(pwd)/quiz.sqlite",  
  "seed": "sequelize db:seed:all --url sqlite://$(pwd)/quiz.sqlite",  
  "migrate_win": "sequelize db:migrate --url sqlite://%cd%/quiz.sqlite",  
  "seed_win": "sequelize db:seed:all --url sqlite://%cd%/quiz.sqlite"  
```

Para ejecutar la migración y el seeder invocar los comandos:

```
$ npm run migrate  
$ npm run seed
```

o su versión con **_win** para máquinas con Windows.

Nota: El comando sequelize tiene un fallo y no permite que existan espacios en blanco en la URL que apunta al fichero **quiz.sqlite**. Desarrolle esta práctica en un directorio cuya ruta absoluta no contenga espacios en blanco

#### La Ruta:

El alumno debe editar el fichero **routes/index.js** para definir la ruta **GET /quizzes**.
Use **routes** y su método **get**. El primer parámetro es el path de la ruta, es decir, **"/quizzes"**. 

El segundo parámetro es la función middleware que debe renderizar el listado de quizzes. 

El método middleware debe desarrollarse en un fichero controlador llamado **controllers/quiz.js** (debe crear el directorio `controllers`), y debe llamarse **index**.

El fichero **routes/index.js** debe requerir el fichero **controllers/quiz.js** para poder acceder al método **index** que exporta.

#### El Controlador

El alumno debe crear el directorio **controllers** y un nuevo fichero **quiz.js** donde desarrollará los middlewares relacionados con los quizzes, que en nuestro caso solo es uno, y se debe llamar **index**.

El fichero **controllers/quiz.js** debe requerir el módulo **models** (**models/index.js**) para poder acceder al modelo **Quiz**. 

Se debe definir y exportar el middleware **index** en el controlador **controllers/quiz.js**. Este middleware debe obtener todos los quizzes existentes en la base de datos usando **findAll**, y renderizar la vista **views/quizzes/index.ejs** con los quizzes obtenidos usando el método **res.render**.

```
  exports.index = async (req, res, next) => {???};
```

#### La Vista

El alumno debe crear el directorio **quizzes** dentro del directorio **views**, y añadir en dicho directorio el fichero **index.ejs** que implementa la vista de una lista de quizzes. 
Esta vista debe ser un elemento HTML de tipo **\<section\>** que muestre un título y la lista de quizzes.

El título debe ser una cabecera **h2** con el texto "*Lista de Quizzes*".

La vista recibirá la lista de quizzes a mostrar como un array de quizzes, que será el mismo array que devolvió la llamada **findAll**. Debe usarse un bucle o un iterador para generar el HTML que muestra la lista de quizzes.

Cada quiz se mostrará en una línea con la pregunta y la respuesta separadas por dos puntos. Por ejemplo, "**Capital de Italia: Roma**".

#### Probar

Ahora el servidor debe responder a la petición **http://localhost:3000/quizzes** mostrando el listado de todos los quizzes.

## Prueba de la práctica

Para ayudar al desarrollo, se provee una herramienta de autocorrección que prueba las distintas funcionalidades que se piden en el enunciado. Para utilizar esta herramienta debes tener node.js (y npm) (https://nodejs.org/es/) y Git instalados.

Para instalar y hacer uso de la herramienta de autocorrección en el ordenador local, ejecuta los siguientes comandos en el directorio raíz del proyecto, es decir, en el directorio padre del directorio **quiz_express**:

```
$ sudo npm install -g autocorector    ## Instala el programa de test
$ autocorector                   ## Pasa los tests al fichero a entregar
............................     ## en el directorio de trabajo
... (resultado de los tests)
```

También se puede instalar como paquete local, en el caso de que no dispongas de permisos en 
el ordenador en el que estás trabajando:

```
$ npm install autocorector     ## Instala el programa de test
$ npx autocorector             ## Pasa los tests al fichero a entregar
............................   ## en el directorio de trabajo
... (resultado de los tests)
```

Se puede pasar la herramienta de autocorrección tantas veces como se desee sin ninguna repercusión en la calificación.



## Instrucciones para la Entrega y Evaluación.

Una vez satisfecho con su calificación, el alumno puede subir su entrega a Moodle con el siguiente comando:

```
$ autocorector --upload
```

o, si se ha instalado como paquete local:

```
$ npx autocorector --upload
```

La herramienta de autocorrección preguntará por el correo del alumno y el token de Moodle. 
En el enlace **https://www.npmjs.com/package/autocorector** se proveen instrucciones para encontrar dicho token.

**RÚBRICA**: Se puntuará el ejercicio a corregir sumando el % indicado a la nota total si la parte indicada es correcta:

- **10%:** Integracion de express-partials
- **10%:** Scripts de package.json
- **10%:** Petición /
- **10%:** Eliminar petición /users
- **20%:** Petición /credits
- **40%:** Petición /quizzes

Si pasa todos los tests se dará la máxima puntuación.
