@REM start tsc
@REM start index.html

start tsc
start nodemon --inspect .\server.js --watch ./server.js
start http://localhost:8000/