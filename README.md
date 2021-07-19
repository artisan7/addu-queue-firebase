# AdDU Vaccination Queuing System

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

# Firebase Configuration

1. Create a new [Firebase]('firebase.google.com') project.

2. Enable authentication with email and password.

3. Create an admin account manually. Take note of its uid.

4. Add your firebase config in secrets.js

```javascript
export const firebaseConfig = {
    ...
}
```

5. Add your uid in secrets.js

```javascript
export const adminUid = "...";
```

6. Seed your database in the Admin page.

7. Create an index in Firestore for the collection "`queue`":

   <center>

   | Field     | Order |
   | --------- | ----- |
   | queueTime | asc   |
   | stage     | asc   |

    </center>
