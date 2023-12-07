// Desc: Validate fields in request body
function validateFields(fields, req) {
    for (let field of fields) {
        if (!req.body[field]) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
    }
    return null;
}

module.exports = validateFields;