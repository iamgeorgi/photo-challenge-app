# Photo-Challenge


## Description
**Photo-Challenge** is a single page application for photo contests. Photo junkies can upload one photo per contest. Organizers can create different contests - private and open, they can select which users can have an access to private contests and also can put a score and comments on photo junkies photos.


<br>
<hr>
<br>


## Project Requirements


### Server

- To run the project, clone the repository.
   - Run **npm install** in the api folder directory to install all of the packages.
   - To run the application locally visit **localhost:3000**

- Setup MySQL Database with new schema.

- Setup **config.js** file. It need to be on the root level in api folder, where the **package.json** is.

```js
{
  host: 'localhost',
  port: '3306',
  user: 'your-username',
  password: 'your-password',
  database: 'your-schema-name',
};
```

- After everything is setup open the terminal and run:
```js 
npm run start:dev
```


<br>
<hr>
<br>


### Client

- Run **npm install** in the client folder directory, to install all of the packages.

- Run **npm start** to start the project.


<br>
<hr>
<br>


### Built with:

- [ReactJS](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [MySQL](https://www.mysqltutorial.org/)
- [sweetalert2](https://sweetalert2.github.io/)
- [JWT](https://jwt.io/)


<br>
<hr>
<br>

### Authors
 - Georgi Petrov - georgipeetrov@gmail.com
 - Anzhelo Dimitrov - anzh.dimitrov@gmail.com