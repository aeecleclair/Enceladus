# Enceladus

## Presentation

Enceladus is a collection of open-source websites created by ÉCLAIR, the computer science association of Ecole Centrale de Lyon. They complete the Myecl application, using the same API, [Hyperion](https://github.com/aeecleclair/Hyperion).

This project is based on Next.js. Like Hyperion, the structure of this project is modular. A new website can be added very easily, with core elements shared across all of them.

## 1. Installing pre-requisites

You first need node.js and npm, a guide for installing those can be found on npm's website here : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

You can then clone this repository. In the project's root folder, run `npm i` to install all requirements (including React and Next.js).

## 2. Setup

### Environment variables

> [!IMPORTANT]
> Copy the [`.env.template`](.env.template) file in a new `.env` file.

This file includes important variables (like the url of your website) needed to start. The default values are perfect for local development.

### API Code generation

This project uses code generation with [Hey API](https://github.com/hey-api/hey-api) to automatically create functions and types allowing easy integration of an API (Hyperion) in the project.

**You need to edit the [`openapi-ts.config.ts`](openapi-ts.config.ts) file to change the input url to your local instance of Hyperion if you modify anything in the API.**
The URL should then be something like `http://localhost:8000/openapi.json` (don't forget to switch from https to http).

> [!IMPORTANT]
> If you did switch to your local Hyperion, keep in mind it has to be running before running the next command.

When you are ready, run `npm run generate` to run the code generation.

## 3. Starting up

Run `npm run dev` to start the websites.

> [!NOTE]
> You need to have an Hyperion instance running, and the right url set in the .env file.

You can then access the different websites, for example `rentree.localhost:3000`. All websites use this url structure (localhost:3000 leads to a 404 error), with the first word being the name of the folder it's in.

> [!NOTE]
> For an explanation of how it works, see the appendix.

## 4. Adding a new website

The template is here to help you create a new website more easily.
To use it (all of these steps are pretty straightforward, the file editing is basically a copy paste too) :

- copy the [src/app/template](src/app/template) folder
- rename all 'template' strings inside with the name of your website (including the folder name)
- duplicate [src/translations/{locale}/template.json](src/translations) (for all locales).
- modify [src/global.d.ts](src/global.d.ts) to import the new translation files and add it as a type
- modify [src/i18n/request.ts](src/i18n/request.ts) to add the translation file in the message dictionnary
- modify [src/proxy.ts](src/proxy.ts) to add the subdomain mapping with your src/app folder

## Appendix : how the routing works

Enceladus uses NextJs for routing (e.g. choosing which page to display for a given url), more precisely the App Router : it uses the folder structure of the project, meaning that when entering the url `localhost:3000/rentree/admin`, Next will display the page `app/rentree/admin/page.tsx`.

Enceladus additionnally uses the `proxy.ts` file to modify the URLs before serving them to the App Router. `xxx.myecl.fr/yyy` becomes `myecl.fr/xxx/yyy`, which allows for multiple websites on the same Next server with a strict access separation.
