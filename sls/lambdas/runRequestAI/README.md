# run request ai

# What's included

- Typescript
- .env file configuration
- ESLint and Prettier for formatting
- Turborepo to quickly run build scripts
- `tsup` to bundle Typescript code
- `tsx` to quickly run compiled code

# How to use

- Clone this repository
- `npm install`
- Write your code in `src`
- `npx turbo run build lint format` to run build scripts quickly in parallel
- `npm start` to run your program

# how to curl the endpoint
Pass in the agency name you would like to make the request on
```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"agency": "NOAA"}' \
  https://44m6gns240.execute-api.us-east-1.amazonaws.com/Dev-Feldman/api/v1/run-request-ai
  ```
