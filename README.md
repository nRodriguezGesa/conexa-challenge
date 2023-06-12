# conexa-challenge

## Description

El proyecto se compone de 2 modulos(apps). Siendo 1 el login y el otro bussiness.

## Running the app

Para correr ambos modulos localmente se debe realizar:
1- npm install
2- npm run start:local
3- En consola habra un log con un link hacia el swagger donde se pueden realizar las pruebas de los endpoints

Se intento deployar ambos modulos en firebase functions y se logro, pero al hacer pruebas se vieron errores en los class-validators, swagger y demas.
Por lo que el deploy no tuvo exito debido a la falta de tiempo

Modulo de Login = https://us-central1-conexa-backend-challenge.cloudfunctions.net/login/

Modulo de Bussiness = https://us-central1-conexa-backend-challenge.cloudfunctions.net/users/users

Para probar las request adjunto 2 collections de postman
