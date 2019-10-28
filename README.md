# My Digital Backpack

This is a proof-of-concept application created by Jobtech to test how an applications can connect and synch with the Open Platforms API (https://www.openplatforms.org). The goal of the Open Platforms project is to enable users to access and share data that they have accumulated while working on Gig platforms.

This project is created in Angular and used Firebase as database and backend. By follwing the instructions below, you should be able to get up quickly.

## Notable depencencies
Since you are reading this, we assume you are a web developer and know that you need to clone this github repo and run nmp install.

### Angular
This project is created using Angular.io. We recommend that you use Angular CLI (https://github.com/angular/angular-cli). Install it through `npm install -g @angular/cli`

### Firebase
We are using Firebase for everything that has to do with authentication, database and backend. We chose this because it's very easy to seup a Firebase environment, see Firebase configuration below. We have however saved our Firebase settings in the repo, so you should be able to test the project locally against our servers.

### Open platforms API
This is the platform that allows users to access their data from Gig platforms. To use the api, you will need to register an account on https://dev.openplatforms.org

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Firebase configuration

This project is configured to be hosted on Firebase. We have added the configuration for our Firebase account to the repo, so you should be able to run the project towards our server while running locally. Naturally you'll need to configure your own instance to deploy the service, which is quite easy to setup following these steps:

1. Create a Firebase project and enable the modules Authentication, Hosting, Firestore, Storage and Functions.
2. Setup email/password + Google and Facebook authentication. Make sure that you add the domain you will be hosting on as a white listed domain.
3. Update the environment files with your settings found on the firebase projects settings page. Currently this is located under Firebase SDK snippet/config. Please note, that we use two environment files depending on if we are doing dev/production.
4. You need to install the Firebase CLI tools: `https://firebase.google.com/docs/cli`. Make sure you follow instuctions on how to login, and connect the Firebase project you just created with `firebase use --add`.
5. To get backend functionality (sending internal notifications and recieving data from Open Platforms) you also need to configure som app secrets used by the Firebase functions, to do this enter:
`firebase functions:config:set app.secret="YOU_OPEN_PLATFORMS_APP_ID" mailclient.user="A_GMAIL_ADRESS_USED_TO_SEND_NOTIFIACTION" mailclient.pass="PASSWORD_FOR_THE_GMAIL_ADRESS"`
As you probably are guessing the gmail account used for internal notifiactions is not the recommended way if you are to scale the service. But it can be handy to see what is happening.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy
Run `firebase deploy` to deploy to the Firebase server after you have build, your project. If you only want to deploy the app or the functions, run `firebase deploy --only hosting` or `firebase deploy --only functions`

## Running unit tests

This project doesn't currently have any unit tests.
<!-- Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). -->

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via Cypress (run 'ng serve first')

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
