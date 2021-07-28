export const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: "addu-vaccination-queue.firebaseapp.com",
    projectId: "addu-vaccination-queue",
    storageBucket: "addu-vaccination-queue.appspot.com",
    messagingSenderId: process.env.VUE_APP_MESSENGERID,
    appId: process.env.VUE_APP_APPID,
};

// export var firebaseConfig = {
//   apiKey: "AIzaSyC_48Ey12HoKX3em425JGInDuMYjL4qSS8",
//   authDomain: "cuakiboards.firebaseapp.com",
//   databaseURL: "https://cuakiboards.firebaseio.com",
//   projectId: "cuakiboards",
//   storageBucket: "cuakiboards.appspot.com",
//   messagingSenderId: "563708874287",
//   appId: "1:563708874287:web:cb2473054859eb088bc0da",
//   measurementId: "G-JL89XGK9YF",
// };

// Initialize Firebase
// export const serviceAccount = {
//   type: "service_account",
//   project_id: "addu-vaccination-queue",
//   private_key_id: "a89896066ec046d2ee2f5e3ce8d8ef83693933e4",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCXRfl1mEOZsykD\nQZGFqud4PUb/hU6FklaKK0x3JmswFyCf+dbvwoo6lH5COiwHkcVMxT9VYDaDktaX\nuthQlT/PRklTDtK4BzHxYsurfimuGcTfLesRTFkUKZo58o6/QG9IJqbwMI0DkdEZ\ntPvX7J7H0C8jUN3odqtFObQZO4JmKrX01bQhy7WUV+oBZpNgsc1XDOIEEi7Dl19V\n6xVu6KKtO6Y09T79XG+MZQk28vXWbWmTrQczgBq2eA6RJGy3oaJNI6DQ9QyARZ/I\nfMLqwF0Cto4LEycSbKzVequOquurlprXgwHBtVC7O78/X/gPwOblsKemb+FVSTFO\nnF0h1uTXAgMBAAECggEAPgLj17Zy48NjaR/MWUiteYdZHu8VOME784j7YA6iOwUI\nDTxcRU3w30G3Hkv9d57ki+uB4mw9/KLJkEp6WVJNZZkw/rjhXaopaYPv7N2blXCf\n2UNYDO/IxnCldeK+bJ0r4R5jKawlalSwrIKaCLJJhqyLXkVMqnpXDFoyv3M7Kcjw\nEC/ge8rHD8SQQgnY83d3awrqP2EX6baex7XEhdWk1YpMy60JI6JI2MYm0yHrADmK\nzhkopUWbzwtiaJW2abHKRfPH8PJfcaSzPJnbnxYyL/Y9E0+rvfs5h6UlqLYQmaFe\nnqDiPj5EcFn2nAnQx+a2DneedVE+yu13MOF/FJ7MdQKBgQDIC0vZjzslXgnFqhpP\nnDlrjeCWcEI7JKDb6zkr0dv2nF4AEpZ0btWvvhyjp9eX6TNWmfGqGmJJRkw4Q8+a\nm3rRhP/Gos8d1XogqRPk3IKr3n2SPehaYtrM1PEdwqO/lYd/DAZkHzAmuGpNWKQY\nRxsPzmyElWUZpzHOh2Nz3HLRowKBgQDBllAu1xW7VvgjX3Lse+roITBSvYgU3oou\n/LTklMqECuPPnS+NoISLIRM5Z2b346oFGtOG2ZDD26MLczjYASd39cwoihcLWppH\n209ihxHe10DSIEf2X59L4qXovh0V+O3nDpIP18XJpzP3EYAiVi+nLXjBrTIiLfoX\nvTvziZJbPQKBgAbUA+HINs+etxytIrrG7VrTe/AGouwb4vW+wLPTNPvk+HxuJf6R\nbe/SwG2BpCVGS39QP+R7hBFWOfHNtr9jQTz3mjdwhTtSdxm4S7qLIFa3gHfGbzDu\noONO/W/znd1DQF3AzlMKkX0w3EgJl4hQnQbcF+4qn0nR4CxZiLaCttSbAoGAa2cB\nxXr/S5jMwpNKJ3n4siD3tnAA99Mfx0Hc+pSyZt/D1IPYxjKwVqBbEhYUQqPEyGBB\nyycZ8hABPXEHsI+zXhK42iUC9AGoZwV93aQifgfeprXSNxaGQovUkHQpnu8kznR/\nBNspmN9zLThAZsx6U74eqRV2IxBvGIycnllNIeECgYBDQzLoBZChiWmw7K0e6yz0\nLqvuuegwiNxbkpKLmLCyRBKGbzzreG6wef73f5Ih9O2f6iSMmIYiTPgQpzod6FEp\nlRl/akcyo3w6KjnOd8lrnccJQRy4wvwbA9ebvHHMwQkT+Sn2aG9je1PS1Yyhryzs\nJYdsXGENoVLdZFjWcmAbpw==\n-----END PRIVATE KEY-----\n",
//   client_email:
//     "firebase-adminsdk-kzf6i@addu-vaccination-queue.iam.gserviceaccount.com",
//   client_id: "101017730973945751888",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kzf6i%40addu-vaccination-queue.iam.gserviceaccount.com",
// };

// export const adminUids = ["H1Mz3R9Y6vVB8ME91LT7jDSN7EH3"];
export const adminUids = ["dRojiWD0xyev6lV89h4w8CYKprQ2"];
