# Setting up Flight Analyser

This project was created by [Andraz Bajec](https://github.com/andrazbajec) and [Tamara Golobic](https://github.com/tamaragolobic)

## Setting up Flight Analyser Database
1. Connect to your database
2. Run all of the `.sql` files from the `flight-analyser-database` folder

## Setting up Flight Analyser Crawler
1. Go into the `flight-analyser-crawler` folder (`cd flight-analyser-crawler`)
2. Create the `.env` from `.env.dist` (`cp .env.dist .env`)
3. Go to [RapidAPI](https://rapidapi.com/) and apply for SkyScanner API keys
4. Add your RapidAPI keys and your database credentials to the `.env` file
5. Run `npm i`
6. Install typescript, if you don't have it installed yet (`npm i -g typescript`)
7. Compile the project with `tsc -w`
8. Run the project with `node javascript/app.js`
9. After the crawler is done, check your data in the database
10. 
### Notes:
* The project was developed with Node 14.16.1 so previous versions might not be supported
* All response data is stored inside the `data` folder where it can be viewed at a later time

## Setting up Flight Analyser API
1. Go into the `flight-analyser-api` folder (`cd flight-analyser-api`)
2. Create the `.env` from `.env.dist` (`cp .env.dist .env`)
3. Enter your database credentials into the `.env` file
4. Run `composer install -o`
5. You can run the PHP server with `php -S localhost:8000`

###Notes:
* The project was developed with PHP 8.0.1 so previous versions might not be supported

## Setting up Flight Analyser Frontend
1. Go into the `flight-analyser-frontend` folder (`cd flight-analyser-frontend`)
2. Create the `.env` from `.env.dist` (`cp .env.dist .env`)
3. Input the URL to the `Frontend Analyser API`
4. Run `npm i`
5. You can run the React compiler & server with `npm start`

### Notes:
* The project was developed with Node 14.16.1 so previous versions might not be supported
* You can build and minify the files with `npm run build` after which the files will be stored inside the `build` folder