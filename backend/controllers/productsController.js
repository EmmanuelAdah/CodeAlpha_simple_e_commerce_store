const Product = require("../models/productModel");
const {productSchema} = require("../middlewares/validator");


exports.addProduct = async (req, res) => {
    const { title, description, price, image, rating } = req.body;
    const validated
        = productSchema.validate({
            title: title,
            description: description,
            price: price,
            image: image,
            rating: rating
    });

    if(validated.error)
        return res.status(400).json(validated.error.details[0].message);

    const product = new Product({
        title: title,
        description: description,
        price: price,
        image: image,
        rating: rating});
    await product.save();
    if(!product)
        return res.status(400).json({message: 'Product not added'});

    return res.status(201).json(product);
}

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    if(!products)
        return res.status(404).json({message: 'No products found'});

    return res.status(200).json(products);
}

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const product = await Product.findById({ _id: id });
    if(!product)
        return res.status(404).json({message: 'Product not found'});

    return res.status(200).json(product);
}

exports.deleteById = async (req, res) => {
    const { id } = req.params()
    const response = await Product.findByIdAndDelete({id: id})
    if (!response)
        return res.status(404).json({message: 'Product not found'})

    return res.status(200).json(
        {message: 'Product deleted successfully'}
    )
}

exports.deleteAll = async (req, res) => {
    const response = await Product.deleteMany();
    if (!response)
        return res.status(404).json({message: 'No products found'})

    return res.status(200).json({message: 'Products deleted successfully'});
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const validated = productSchema.validate(product);
        if (validated.error)
            return res.status(400).json(validated.error.details[0].message);

        const existingProduct = await Product.findById({id});
        if (!existingProduct)
            return res.status(404).json({message: 'Product not found'});

        for (let key in product) {
            const value = product[key];
            if (value !== null || value !== '' || value !== undefined) {
                existingProduct[key] = value;
            }
        }
        const updatedProduct = await existingProduct.save();
        return res.status(200).json(updatedProduct);
    }catch(err){
        return res.status(400).json({message: err.message});
    }
}

