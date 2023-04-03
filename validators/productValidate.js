import Joi from "joi";

const productschema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
});

export default productschema;