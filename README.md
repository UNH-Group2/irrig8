# irrig8
  
  
## How to install/run the application    
1. Download and install the latest version of Node.js following the website instructions for your platform  
   ` https://nodejs.org/en/download/`   
2. Clone this repository into a clean diretory  
   `$ git clone <repository url>`  
3. Bring down the latest package dependencies using node package manager  
   `npm install`  
4. Download and install the latest version of mySQL  
   ` https://www.mysql.com/downloads/`   
5. This package requires a database configuration and password file to connecto to mySQL. The parameters are captured in a .env file which must be supplied to the root folder of the project.  Use the installation of mySQLWorkbench to configure the installation and then use your favorite IDE to enter the following keys-values pairs to the .env file with your id and password:  
  
| File        | Parameters needed for mySQL                                          |  
| ----------- | -------------------------------------------------------------------- |  
| .env        | DB_HOST=__your mySQL host name__   (usually localhost)               |  
|             | DB_USER=__your mySQL account__     (usually root)                    |  
|             | DB_PWD=__your mySQL password__                                       |  
|             | DB_NAME=__irrig8_db__              (default)                         |  
  
__Note:__  .env is added to the .gitignore file to prevent your config and password from being shared in your git repository publically    
  
6. For local deployments, create the database in mySQLWorkbench, sequelize will do the rest    
7. Run the node server app from the command line to test locally   
   `node server.js`  
8. Test your application by opening the browser to "http://localhost:3000/irig8/  
  
## Technology Used    
    
| Package/Interface | Version     | Description |  
| ----------------- | ----------- | ------------------------------------------------------------------------ |  
| Node.js           | __11.1.0__  | Main javascript engine for this application  |  
| mysql2            | __1.5.3__   | mySQL relational database management system & workbench, compatible with sequelize |  
| express           | __4.16.3__  | a node based web server framework |  
| express-handlebars| __3.0.0__   | a node based html templating framework |  
| dotenv            | __6.2.0__   | Utility package to hide the secret keys in a .env file and away from git |  
| sequelize         | __4.38.0__  | Object Relational mapper framework |  
| jawsDB            |             | a mySql compatible relational datbase supported for Heroku remote deployments |   
  
## Authors   
UNH LawnDogs      
January, 2018   
  
## Acknowledgements      
Rachio.com - Sprinkler Control Systems  