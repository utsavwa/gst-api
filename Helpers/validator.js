const Joi = require('joi');

const signupSchema = Joi.object({
    gstin: Joi.string().uppercase().max(15).min(15).required(),
    password: Joi.string().min(8).max(20).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
})

const loginSchema = Joi.object({
    gstin: Joi.string().uppercase().max(15).min(15).required(),
    password: Joi.string().min(8).max(20).required(),
})

const verifyGSTSchema = Joi.object({
    gstin: Joi.string().uppercase().max(15).min(15).required(),
})

const recordGstSchema = Joi.object({
    gstin: Joi.string().uppercase().max(15).min(15).required()
})

const reviewSchema = Joi.object({
    userId: Joi.string().trim().required(),
    gstId: Joi.string().trim().required(),
    reviewText: Joi.string().trim(),
    rating: Joi.number().min(0).max(5)
})

module.exports = { signupSchema, loginSchema, verifyGSTSchema, recordGstSchema, reviewSchema };