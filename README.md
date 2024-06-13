# Virtual 6502
A virtual 6502 processor written in TypeScript and running on Node.js. This project is the practical component of Prof. Gormanly's Computer Organization and Architecture class (CMPT422) at Marist College.

## Credits
This software is an adaptation of a project created by [Dr. Alan Labouseur](http://labouseur.com/courses/os/) for his Operating Systems (CMPT 424) course project, which builds an operating system on top of a rudimentary virtual 6502 CPU. This project focuses on building a robust and complete 6502 architecture and instruction set. This project is a 6502 emulator programmed using TypeScript that will run on server-side JavaScript in Node.js. Here are references to Dr. Labouseur's original projects:
- 2019 version: https://github.com/AlanClasses/TSOS-2019
- 2015-2018 version: https://github.com/AlanClasses/TSOS

There are plans to possibly expand this project in a way that would allow you to continue to use it to build an adapted version of Dr. Labouseur's OS project on top.  Here is an architecture diagram showing how this is planned currently.

![tsiram-6502](./resources/images/architecture/projectArchitecture-v1.jpeg)

## Future Implementation:
* memory actions (R/W) only on clock pulse
* scalar speed - fill pipeline

### TypeScript:
Documentation: https://www.typescriptlang.org/docs/home.html

Installing TypeScript: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
`npm install -g typescript`

## How to run
First run `npm install` to install node dependencies

Next, TypeScript must be compiled before you can run and after you make changes to TypeScript (.ts) files.  There is a provided bash script called 'c' in the project root.  You may need to add execute permission to the file before you can run.  

Once you run it, you should see that a dist/ folder is created in your project home and it contains the JavaScript that your Node.js server will run.

To start the node server run `npm start`

Once you have your project going, you should be able to recompile using the 'c' bash script and then 'npm start' to run node. (./c)

### @types/node
Type definitions to be used for Node.js. This should be installed when you run `npm install` to install dependencies. 
See: https://www.npmjs.com/package/@types/node
If they are not installed you can manually do so this way:
`npm install @types/node --save-dev`
