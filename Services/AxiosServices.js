var axios = require('axios');

module.exports = apiServices = {

    get: async (url) => {
        try {
            const response = await axios.get(url);

            return response;

        } catch (error) {
            console.log('Error in axios get --> ', error);
            return false;
        }
    },

    post: async (url, parameter) => {
        try {
            const response = await axios.post(url, parameter);

            return response;

        } catch (error) {
            console.log('Error in axios post --> ', error);
            return false;
        }
    }
}
