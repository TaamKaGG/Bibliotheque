#!/bin/bash

echo "Installing symfony's dependencies"
composer install
composer update

echo "Load Node registered dependencies"
yarn install

echo "Start symfony server for the API to work"
symfony server:stop
symfony server:start --no-tls -d

echo "Start Nuxt"
yarn dev -o