let getGoogleYolo = function() {
    return new Promise(function(resolve, reject) {
        if (!window.googleyolo) {
            window.onGoogleYoloLoad = function(googleyolo) {
                resolve(googleyolo);
            };
        } else {
            resolve(googleyolo);
        }
    });
}

let registerWithGoogleYolo = function() {
    return new Promise(function(resolve, reject) {
        getGoogleYolo().then(function(googleyolo) {
            const retrievePromise = googleyolo.retrieve(yoloConfig);
            retrievePromise.then(function(credential) {
                if (credential.password) {
                    alert("Error with sign in. Please contact the administrator.");
                    reject("Error");
                } else {
                    resolve(credential);
                }
            }, function(error) {
                if (error.type === 'noCredentialsAvailable') {
                    googleyolo.hint(yoloConfig).then(function(credential) {
                        if (credential.idToken) {
                            resolve(credential);
                        } else {
                            alert("Please login to Gmail first, and then refresh this page");
                            console.log("User needs to sign in to Google first");
                            reject("Error");
                        }
                    }, function(error) {
                        alert("Please login to Gmail first, and then refresh this page");
                        console.log("User needs to sign in to Google first");
                        reject("Error");
                    });
                }
            });
        });
    });
}