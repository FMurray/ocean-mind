#!/bin/bash

if [ -f "openAI.zip" ]; then
    rm ./openAI.zip
fi

mkdir dist
mkdir dist/nodejs

cp ./package.json ./dist/nodejs/package.json

cd dist/nodejs

npm i --prod

# remove unneeded files
rm package-lock.json
rm package.json

cd ../
zip -r openAI.zip ./
mv openAI.zip ../
