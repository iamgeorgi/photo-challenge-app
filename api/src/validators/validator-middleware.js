export const createValidator = schema => {
    return (req, res, next) => {
        const body = req.body;
        const file = req.file;
        const validations = Object.keys(schema);

        const fails = validations
            .map((v) => v === 'filename' ? schema[v](file[v]) : schema[v](body[v]))
            .filter(e => e !== null);

        if (fails.length > 0) {
            res.status(400).send(fails);
        } else {
            next();
        }
    };
};