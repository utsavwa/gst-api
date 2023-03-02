require('dotenv').config();
const { verifyGSTSchema, recordGstSchema } = require('../Helpers/validator.js');
const ApiServices = require('../Services/AxiosServices.js');
const Gst = require('../Models/GST/GstModel.js');
const gstDetails = require('../Services/gstDetails.js');

exports.verifyGST = async (req, res, next) => {
    try {

        /* --------- validate request parameter --------- */
        const validateResult = await verifyGSTSchema.validateAsync(req.body);

        const query = `?keyword=${validateResult?.gstin}`;

        const gstin = await ApiServices.get(process.env.MAIN_GST_API + query);

        if (gstin?.data?.success) {
            res.status(200).json({
                status: true,
                data: gstin?.data?.data
            });
        } else {
            res.status(206).json({
                status: false,
                data: {}
            });
        }

    } catch (error) {
        if (error.isJoi === true) {
            return res.status(422).json({
                status: false,
                message: error?.details[0]?.message,
            });
        }
        next(error);
    }
}

exports.recordGst = async (req, res, next) => {
    try {
        /* --------- validate request parameter --------- */
        const validateResult = await recordGstSchema.validateAsync(req.body);

        const isAnyGst = await Gst.findOne({ gstin: validateResult?.gstin });

        const gstin = await gstDetails(validateResult?.gstin);

        if (isAnyGst !== null) {
            return (
                res.status(200).json({
                    status: true,
                    message: 'Already have this gst record!',
                    data: isAnyGst
                })
            )
        } else {
            if (gstin?.status) {
                const gst = await Gst.create({
                    gstin: validateResult?.gstin,
                    gstData: gstin?.data,
                })
                return (
                    res.status(200).json({
                        status: true,
                        message: 'Successfully inserted gst record!',
                        data: gst
                    })
                )
            } else {
                return (
                    res.status(400).json({
                        status: false,
                        message: 'Enter valid gst number.'
                    })
                )
            }
        }

    } catch (error) {
        if (error.isJoi === true) {
            return res.status(422).json({
                status: false,
                message: error?.details[0]?.message,
            });
        }
        next(error);
    }
}

exports.searchGST = async (req, res, next) => {
    try {
        const size = parseInt(req.query.size || 10) * parseInt(req.query.page);

        var regex = new RegExp(req.params.gstin, 'i');

        const allGst = await Gst.find({ gstin: regex });
        const response = await Gst.find({
            gstin: regex,
        }).limit(size);

        res.status(200).json({
            gst: response,
            total_page: Math.ceil(allGst.length / parseInt(req.query.size || 10))
        });
    } catch (error) {
        console.log('Error, while searching gst: ', error);
        return (
            res.status(401).json({
                status: false,
                message: "Something went wrong, Please try again latter...!"
            })
        )
    }
}

exports.fetchAllGst = async (req, res, next) => {
    try {
        const size = parseInt(req.query.size || 10) * parseInt(req.query.page);

        const allGst = await Gst.find(); 

        await Gst.find().limit(size)
            .then((results) => {
                res.status(200).json({
                    gst: results,
                    total_page: Math.ceil(allGst.length / parseInt(req.query.size || 10))
                });
            }).catch((error) => {
                res.status(401).json({
                    status: false,
                    message: "Something went wrong, Please try again latter...!"
                })
            })
    } catch (error) {
        console.log('Error, while fetching all gst: ', error);
        return (
            res.status(401).json({
                status: false,
                message: "Something went wrong, Please try again latter...!"
            })
        )
    }
}

exports.fetchGst = async (req, res, next) => {
    try {
        await Gst.findOne({gstin: req.params.gstin})
        .then((result)=>{
            res.status(200).json({
                status: true,
                data: result || [],
            });
        }).catch((error)=>{
            res.status(401).json({
                status: false,
                message: "Something went wrong, Please try again latter...!"
            })
        })
    } catch (error) {
        console.log('Error, while fetching gst: ', error);
        return (
            res.status(401).json({
                status: false,
                message: "Something went wrong, Please try again latter...!"
            })
        )
    }
}