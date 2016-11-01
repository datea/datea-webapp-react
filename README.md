# Datea: web app for datea.pe platform

This is a rewrite of our current platform based on reactjs, mobx, webpack, and material design. The former version (still online) is based on angular 1 and bootstrap. The main reason for this rewrite are:

* To ensure a more future proof version of Datea using more flexible and up to date tools. Using angular 1 proved to be negative in this regard, which is why we now favor a react based approach, as a more flexible option, assembled of various smaller packages taking care of specific functions (react for the views, mobx for state management etc), which can be replaced or updated in the future with less pain than the all encompassing angularjs. The structure is less specific to a framework, more just a way of doing things.
* Reactjs, mobx and co are much, much easier to learn and reason with than angular (even angular 2), making it easier for developers to step in and contribute.
* With webpack, we're able to create different entry points (web, embed, etc), reusing our components across the board in a simple and transparent way. This way we only have 1 repo and code base for mobile, desktop, embed, whatever.
* Adopt a truly mobile first approach from the start, which was never the case in the previous version (Big mistake!!).
* Get rid of our current mobile apps which run on cordova (avoid the headache!) and go for a PWA (progressive web application). Having to deal with compilation, testing and the bureaucracy of app stores is unsustainable for this project.
* Simplify the platform where possible. Implement what we've learned during these years.

###Basic Structure
The separation between front end and backend for Datea is complete. Almost all communication with the backend is done via json endpoints (REST). Check the backend repo [datea-api](http://github.com/datea/datea-api/doc/) (based on django and tastypie) for documentation about the individual endpoints.

###Roadmap
Current standpoint is:
* All the account related functionality is in place and has been improved.
* Mockups for the rest are in progress, will be probably ready by the end of November 2016.
* We're evaluating the use material-ui for our widgets. We might switch to react-toolbox. Material-ui has a larger community and better documentation, which is one of the reasons we chose it in the first place, but it's reliance on css in javascript is kind of annoying, which is why we're considering the switch to react-toolbox and css modules.
* After the mockups are sufficiently mature to start development, we'll add whatever features needed to the backend and start developing. A first release could be ready end of march 2017. All current data on the platform will be kept.

###Development
Development runs with webpack-dev-server and hot reload of react modules (not always perfect, though, somethimes you need to reload it yourself).

1. clone the repo.
2. Install dependencies: `npm install`
3. Run webpack dev server: `npm run dev`
4. Open web browser on `http://localhost:9000`

Good to go!

###Build
1. If not installed previously: `npm install`
2. Run `npm build`.

Resulting build will be in the `dist` folder.

###Test
Testing will be a work in progress. As we want to move fast now, we'll do only tests for crucial functionality (some might object, objections welcomed!). The testing framework still needs to be added, but will probably consist of mocha, sinon, chai, enzyme...


###Notes on workflow
Everything should be kept as modular as possible. We're using webpack to require styles, images and other assets, which in case they are used only in one individual module, should be placed in the same directory of their module. For generic assests, use the `img`, `scss`, `fonts`, `icons` dirs.

###Icons
We're using webpack-svgstore-plugin to generate a svg icons for our custom icons. Look for DIcon components somewhere in the src to see how they work. For the rest, we're using material-ui icons.

###i18n
The Datea web is currently available in Spanish and French. We want to keep it that way, and add English and maybe Portuguese! We're using polyglot for the internationalization. Language files are located in `i18n/locales`. Structure might still change! Check out current src for examples on how to use.

Please get in touch if you'd like to participate or give some feedback!
