<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## About Shamiri Task

This app fetches Locations, Characters and Episodes from the Rick and Morty API. I decided to build the app with Next.js, Bootstrap 5 and Laravel 9 for both speed and ease of use, for persisting character notes I decided to go with Laravel and MySQL for it's simplicity and robustness if I ended up needing to do complex queries or auth. I've used both Tailwind and Bootstrap in my previous projects but since I need to do this quickly with the given time constraint I went with Bootstrap 5 because I'm just faster with it as I know most of the classes at the top of my head.

I decided to use the REST API endpoint over the GraphQL endpoint because of the following points:

Simplicity and Familiarity:

```
1. REST APIs are well-established and widely used in the industry. They follow a straightforward request-response model, making 	them easy to understand and work with.

  Since the task is straight forward, REST might provide a more straightforward solution without the need for the complexity introduced by GraphQL.

Project Scope and Size:

For smaller projects or projects with a limited scope, REST is a more lightweight and practical choice. GraphQL's benefits become more apparent in larger and more complex applications with varied data requirements.
```

## Project Setup

This project uses

```
Next v12
React v17
Node v16.20.0
PHP v8.0.25
Laravel v9.19.
```

Composer and Xampp/Lampp (comes with PHP 8) are needed before hand. Once installed clone this repo into "C:\xampp\htdocs".

In one terminal once in the project root folder

```
- •	npm install
- •	npm run dev (runs on localhost:3000)
```

In another terminal once in the project root folder

```
- •	composer install
- •	cp .env.example to .env
- •	change username and password in .env
- •	php artisan key:generate
- •	php artisan storage:link
- •	php artisan migrate
- •	php artisan serve (runs on localhost:8000)
```
