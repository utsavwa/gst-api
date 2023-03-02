const Review = require('../Models/Review/reviewModal.js');
const { reviewSchema } = require('../Helpers/validator.js');

exports.writeReview = async (req, res, next) => {
    try {
        /* --------- validate request parameter --------- */
        const validateResult = await reviewSchema.validateAsync(req.body);

        const review = await Review.create({
            userId: validateResult?.userId,
            gstId: validateResult?.gstId,
            reviewText: validateResult?.reviewText,
            rating: validateResult?.rating,
        });

        review.save()
            .then(() => {
                res.status(201).json({
                    status: true,
                    data: review
                });
            }).catch((error) => {
                res.status(401).json({
                    status: false,
                    message: "Something went wrong, Please try again latter...!"
                })
            })
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

exports.fetchReview = async (req, res, next) => {
    try {
        const size = parseInt(req.query.size || 10) * parseInt(req.query.page);

        const allReview = await Review.find({gstId: req.params.gstid});
        const response = await Review.find({
            gstId: req.params.gstid,
        }).limit(size).populate('userId');

        res.status(200).json({
            reviews: response,
            total_page: Math.ceil(allReview.length / parseInt(req.query.size || 10))
        });

    } catch (error) {
        console.log('Error, while fetching review :', error)
        return (
            res.status(401).json({
                status: false,
                message: "Something went wrong, Please try again latter...!"
            })
        )
    }
}