#!/bin/bash

if [ -f "runRequestAI.zip" ]; then
    rm ./runRequestAI.zip
fi

mkdir dist

cp ./package.json ./dist/package.json

cd dist

# remove unneeded files
rm -rf package-lock.json
rm -rf test

npm rm langchain
npm i --prod

zip -r runRequestAI.zip ./
cp runRequestAI.zip ../../../dist/
cp runRequestAI.zip ../

