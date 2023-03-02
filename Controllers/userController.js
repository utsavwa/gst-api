const User = require('../Models/User/userModel.js');
const { signupSchema, loginSchema } = require('../Helpers/validator.js');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const createToken = (id, gstin) => {
    return jwt.sign(
        {
            id,
            gstin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '10d',
        },
    );
};

exports.signup = async (req, res, next) => {
    try {

        /* --------- validate request parameter --------- */
        const validateResult = await signupSchema.validateAsync(req.body);

        const isAnyUser = await User.find({ gstin: validateResult?.gstin });

        if (isAnyUser?.length > 0) {
            return res.status(404).json({
                status: false,
                message: "This GST number already exist.!"
            })
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(validateResult?.password, salt, async function (err, hashPassword) {
                const user = await User.create({
                    gstin: validateResult?.gstin,
                    password: hashPassword,
                });
                const token = createToken(user.id);

                user.password = undefined;

                res.status(201).json({
                    status: true,
                    token,
                    data: user
                });
            });
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

exports.login = async (req, res, next) => {
    try {

        /* --------- validate request parameter --------- */
        const validateResult = await loginSchema.validateAsync(req.body);

        // 1) check if user exist and password is correct
        const user = await User.findOne({ gstin: validateResult?.gstin }).select("+password");

        if (!user || !(await user.correctPassword(validateResult?.password, user.password))) {
            return res.status(401).json({
                status: false,
                message: 'GST number or Password is wrong..!',
            });
        }

        // 2) All correct, send jwt to client
        const token = createToken(user.id, user.gstin);

        // Remove the password from the output
        user.password = undefined;

        res.status(200).json({
            status: true,
            token,
            data: user
        });
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