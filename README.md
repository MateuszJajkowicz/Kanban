# Kanban

<h3>You can check it online at https://mj-kanban.web.app/ </br>
You can login as:
  <ul>
     <li>
        login: test@example.com</br>
        password: 123456
     </li>
     <li>
        Or just use your google account
     </li>
  </ul>
</h3>

> Kanban app inspired by Trello built with the Angular & Firebase.

![screenshot](https://github.com/MateuszJajkowicz/Kanban/blob/master/screenshots/kanban_screenshot_1.png)
![screenshot](https://github.com/MateuszJajkowicz/Kanban/blob/master/screenshots/kanban_screenshot_2.png)

## Features

- Angular 14.x + Firebase
- Installable PWA
- OAuth and Email/Password Signup with Firebase
- Drag & drop boards Kanban with Firestore
- Calendar - if any task has a date assigned to it, it will be displayed in calendar
- Profile Screen
- Adding friends
- Sharing tasks with friends

## Usage

### Create a project at https://firebase.google.com/ and grab your web config

### Add the config to your Angular environment

Create a environments folder and to files (environment.ts and environment.prod.ts) inside this folder and add the following

In environment.ts:
```
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
};
```

In environment.prod.ts:
```
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
};
```

### Install Dependencies

```
npm install
```

### Run

```
# Run `ng serve`
