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
