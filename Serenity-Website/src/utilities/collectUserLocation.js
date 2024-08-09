// function to get user's location
export const collectUserLocation = () => {
    // Return a promise to handle the async operation
    return new Promise((resolve, reject) => {

        // Check if the user's browser supports geolocation
        if (!navigator.geolocation) {
            // If not, reject the promise with an error message
            return reject(new Error('Geolocation is not supported by your browser'));
        }

        // Use the geolocation API to get the user's current position
        navigator.geolocation.getCurrentPosition((position) => {

            // Extract the latitude and longitude from the position object
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude;

            // Resolve the promise with the location data
            resolve({ latitude, longitude });
        },
            (error) => {
                // Handle errors, including permission denial and other errors
                if (error.code === error.PERMISSION_DENIED) {
                    reject(new Error('User denied geolocation permission'));
                } else {
                    reject(new Error('Failed to get user location'));
                }
            }
        )

    })
};