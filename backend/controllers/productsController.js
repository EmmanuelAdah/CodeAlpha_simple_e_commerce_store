
const BASE_URI = process.env.PRODUCTS_BASE_URI;

exports.getProducts = async (req, res) => {

    let response = await fetch(`${BASE_URI}/products`);
    console.log("res:", response.url);

    if(!response.ok)
        throw new Error('Something went wrong');
    return res.status(200).json(response);
}