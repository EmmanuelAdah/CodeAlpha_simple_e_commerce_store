const bcrypt = require('bcrypt');
const {createHmac} = require("node:crypto");

exports.doHash = async (password, saltValue = 12) => {
    return await bcrypt.hash(password, saltValue);
};

exports.doValidation = async (password, hashedValue) => {
    return await bcrypt.compare(password, hashedValue);
}

exports.hmacProcess = (value, key) => {
    return createHmac('sha256', value).update(key).digest('hex');
}