module.exports = (err, req, res, next) => {

    const errObj = {
        status: err && err.status ? err.status : 500,
        method: req.method,
        endpoint: req.originalUrl,
        details: err && err.details ? err.details : "Internal Server Error x_x",
        devMessage: err && err.devMessage ? err.devMessage : undefined,
        source: err && err.source ? err.source : undefined,
        params: err && err.params ? err.params : undefined,
    };

    if (errObj.status === 500) {
    // A Nice Consoled Message
    console.log(new Error(errObj.devMessage || errObj.details).stack
                .replace(/(?<=\n\s+)(.*)(?=\n\s)/g, match => {
                    if (!match.includes("node_modules")) {
                        return `\x1b[31m${match}\x1b[0m`;
                    } else {
                        return match;
                    }
                }));
    }

    res.status(errObj.status).json(errObj);

}