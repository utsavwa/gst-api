const ApiServices = require('./AxiosServices.js');

async function gstDetails(gstNumber) {
    const query = `?keyword=${gstNumber}`;

    const gstin = await ApiServices.get(process.env.MAIN_GST_API + query);

    if (gstin?.data?.success) {
        return {
            status: true,
            data: gstin?.data?.data
        };
    } else {
        return {
            status: false,
            data: {}
        };
    }
}

module.exports = gstDetails;