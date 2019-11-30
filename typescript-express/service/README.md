# Using Typescript with Node JS

In this article we will set up an [Express][1] application using [Typescript][2].

## Requirements

In order to follow this tutorial you will need the latest version of [Node js][3] installed.
I recommend installing node js via [Homebrew][5] if you are on OSX.
Once node is installed, we can initialise our project using [NPM][6].

Optionally you should install [Visual Studio Code][7].
This is a code editor from Microsoft that is built using Typescript.
It provides an excellent environment for working with Typescript and many other programming languages.

## Setting Up a Typescript Project

Now that the prerequisites are installed we can begin setting up the Typescript project.
Open up a terminal, create, and cd into a directory called _express-ts_.
In this directory we will initialize our `npm` project.

Use the following commands to do so:

```
mkdir express-ts
cd express-ts
npm --init -y
```

Now that we are in the created directory and we have initialised our `npm` project we will install Typescript and generate a `tsconfig.json`.
To do this we must install Typescript as a project dependency.


Run the following command to do so:

```
npm install --save typescript
```

Now that Typescript is installed as a dependency we can initialise our Typescript project via `npm`.

Firstly we must tell `npm` to use the project's version of `tsc`, the Typescript compiler.
To do this update the generated `package.json` file to the following, which aliases `tsc` to the project's version of `tsc`.

```json
{  
  "dependencies": {
    "typescript": "^2.7.1"
  },
  "scripts": {
    "tsc": "tsc"
  }
}
```

By adding `"tsc": "tsc"` inside _scripts_ we can run the following command, which will generate a default `tsconfig.json` file.

```
npm run tsc -- --init
```

Running the above command creates the `tsconfig.json` in the current directory.
It also adds some useful boilerplate code to the file.
Looking inside the newly generated `tsconfig.json` you should see the following.

```javascript
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "./",                    /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "./",                       /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

For the purposes of this demo we are going to put the compiled `.js` files into a `build` directory.
In order to tell the Typescript compiler that this is where the compiled files should go we must use the `outDir` parameter.
Uncomment the `outDir` parameter and give it the value `"./build"`, it should look like the following.

```json
"outDir": "./build",
```

Now that the `tsconfig` is correctly set up we will add some Typescript Definition files or `.d.ts` files via the `@types` module.
These files are used to give the compiler knowledge of the application.

As we will be using Express and ES2015 syntax. We need to install the `es6-shim`, and `express` typings.
Run the following command to do so.

```
npm install --save @types/express @types/es6-shim
```

Now we can install `express` via NPM.
In the application root folder run the following.

```
npm install --save express
```

This installs Express as a dependency.

Finally lets create the application files.
Make a folder called `app` and add a `server.ts` file.
The application will be a _greeter_. So lets also add a `WelcomeController`.
Inside the app folder create another folder called `controllers` and a `welcome.controller.ts` and `index.ts` file.

```
mkdir app && cd app
touch server.ts
mkdir controllers && cd controllers
touch index.ts welcome.controller.ts
```

The application should now have the following structure.

```
.
├── app
│   ├── controllers
│   │   ├── index.ts
│   │   └── welcome.controller.ts
│   └── server.ts
├── node_modules
├── package.json
└── tsconfig.json

```

## Creating An Express App

As mentioned above we will be creating a greeting app.
This app will have one route that takes a `name` parameter and then greets that name.

Open a text editor inside the application folder.
If you are using Visual Studio Code you can open it inside the folder by running the `code` command with a folder argument.

```
code .
```

Firstly lets take a look at the `welcome.controller.ts` file.
This file will handle the welcome routes.
To do this we need it to export an Express router object.
I have added code comments to the snippet below which explains how this file should work.

```typescript
/* app/controllers/welcome.controller.ts */

// Import only what we need from express
import { Router, Request, Response } from 'express';

// Assign router to the express.Router() instance
const router: Router = Router();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.get('/', (req: Request, res: Response) => {
    // Reply with a hello world when no name param is provided
    res.send('Hello, World!');
});

router.get('/:name', (req: Request, res: Response) => {
    // Extract the name from the request parameters
    let { name } = req.params;

    // Greet the given name
    res.send(`Hello, ${name}`);
});

// Export the express.Router() instance to be used by server.ts
export const WelcomeController: Router = router;
```

Now that the `WelcomeController` is ready to be used lets export it from the _controllers_ folder.
As you may know `index` files act as folder entry points.
Thanks to this we can access exports from the `index.ts` file we created in the _controllers_ folder.
Add the following to that file.

```typescript
/* app/controllers/index.ts */
export * from './welcome.controller';
```


**Note:** as good practice you should never add application logic inside an index file.

Now that the `WelcomeController` is being correctly exported lets make use of it inside the `server.ts` file.


```typescript
/* app/server.ts */

// Import everything from express and assign it to the express variable
import express from 'express';

// Import WelcomeController from controllers entry point
import {WelcomeController} from './controllers';

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: number = process.env.PORT || 3000;

// Mount the WelcomeController at the /welcome route
app.use('/welcome', WelcomeController);

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
```

Now that we have finished writing the application lets transpile it to javascript.
In the root of the application run the following.

```
npm run tsc
```

Alternatively you may run the following to tell the Typescript compiler to run everytime it detects a filesystem change.

```
npm run tsc -- --watch
```

These commands will tell the Typescript compiler to build the application based on the `tsconfig.json`.
If everything has been successfull you will see a newly created `build` directory.
This is where the Typescript compiler has placed the generated `.js` files based of the optional `outDir` parameter in the `tsconfig`.

We can now run the app with the following command.

```
node build/server.js
```

Open a browser at the following url [http://localhost:3000/welcome](http://localhost:3000/welcome).
You should be greeted with a _Hello, World!_.
Try visiting [http://localhost:3000/welcome/Borris](http://localhost:3000/welcome/Borris) to confirm the
`WelcomeController` is functioning correctly.
You should see a _Hello, Borris!_.


## Summary

This application, though simple, gives a good basis for creating future Express applications with Typescript.

You have learned how to intialise a Typescript application from the command line.
You have also seen how to make use of Typings within a Typescript application.
Learning how to use typings is very important when working with Typescript as they give the compiler a better knowledge of the application.
The more the compiler knows, the better it can help you out.

You have also learned a bit about structuring an Express application.
Many Express tutorials bundle code into one big `server.js` file.
This leads to an application that is very difficult to maintain and is not representative of real world applications.
However we have seen here that it is possible to _mount_ Express Router instances so that applications can be broken down into modular parts.
This leads to more maintainable and scalable applications.

## Next Steps?

Working with data is an important skill to learn when using Node.
So, with the knowledge gained here I would recommend investigating using Express and Typescript with the [Sequelize][8] ORM.
It is an awesome NPM package which lets a Node app easily communicate with an SQL database.
This will allow you to create dynamic and data driven Node apps.


---

_Finished application files can be found on github at the below link._


[https://github.com/BrianDGLS/express-ts](https://github.com/BrianDGLS/express-ts)


[1]: http://expressjs.com/
[2]: https://www.typescriptlang.org/
[3]: https://nodejs.org/en/
[4]: https://github.com/typings/typings
[5]: http://brew.sh/
[6]: https://www.npmjs.com/
[7]: https://code.visualstudio.com/
[8]: http://docs.sequelizejs.com/en/v3/
