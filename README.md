# Spacee2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3.
Node.js version 16 for using JSON imports.

npm i  
ng serve  

May need to go into config.json, and add personal secrets to keep application running for local environment.

Completed tasks 1, 2, and 3.

Bugs:  
*iFrame will load twice, causing the function call on (load) to throw an error while elements aren't loaded.  
*On Chrome with DevTools open without responsive view enabled, the initial load will incorrectly calculate viewport width. For some reason, that 
is the only instance where innerWidth of Window is not used.