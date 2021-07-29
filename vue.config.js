// vue.config.js
module.exports = {
    // options...
    devServer: {
        // disableHostCheck: true
        proxy: "https://us-central1-addu-vaccination-queue.cloudfunctions.net",
    },
};
