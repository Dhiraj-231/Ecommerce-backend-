import Product from "../Models/productModel.js";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import Joi from "joi";
import fs from "fs";
import productschema from "../validators/productValidate.js";
const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, "uploads/"),
    filename: (req, file, callback) => {
        const uniqueName = ` ${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        callback(null, uniqueName)
    }
});

const handleMultipartdata = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image');

const productController = {
    async store(req, res, next) {
        //multipart form data
        handleMultipartdata(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            //validating request
            const { error } = productschema.validate(req.body);

            if (error) {
                //deleting uplaoded file if the validation filed
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                })
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath,
                })
            } catch (error) {
                return next(error)
            }
            res.status(201).json({ document })

        })
    },

    async update(req, res, next) {
        handleMultipartdata(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            if (req.file) {
                const filePath = req.file.path;
            }
            //validating request
            const { error } = productschema.validate(req.body);

            if (error) {
                //deleting uplaoded file if the validation filed
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    })
                }
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath }),
                }, { new: true });
                console.log(document);
            } catch (error) {
                return next(error)
            }
            res.status(201).json({ document })

        })
    },

    async GetAll(req, res, next) {
        try {
            const products = await Product.find({}).select(" -updatedAt -__v");;
            console.log(products);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message))
        }
        res.status(200).json({ message: "Got it" })
    },

    async Delete(req, res, next) {
        try {
            const data = await Product.findOneAndDelete({ _id: req.params.id });
            if (!data) {
                return next(new Error('Nothing to delete'))
            }
            //ineed image to be delete also
            const path = data.image;
            fs.unlink(` ${appRoot}/${path}`, (err) => {
                if (err) {
                    return next(CustomErrorHandler.serverError());
                }
            })
            res.status(200).json(data)
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message))
        }

        res.status(200).json({
            message: "data has been deleted"
        })
    },
    async getParticular(req, res, next) {
        try {
            const data = await Product.findById({ _id: req.params.id });
            if (!data) {
                return next(CustomErrorHandler.NotFound());
            }

            res.json(data);

        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message))
        }
    }
}

export default productController;