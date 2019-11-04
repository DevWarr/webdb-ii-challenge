/**
 * Checks an array of specified properties 
 * to ensure they exist in the `req.body`.
 * 
 * - Properties that pass the check are saved as properties of the `res.locals.valid` object.
 * 
 * - You can specify whether all variables are required or not.
 * If you only want to verify that any `req.body` is given, call this function with 
 * empty parentheses.
 * 
 * @param {string[]} check          Properties that should exist in the `req.body`.
 *                                  Property names should be strings within an array.
 * @param {boolean} allRequired     Whether ALL of the variables are required or not
 */
module.exports = (check = [], allRequired = true) => (req, res, next) => {

    //==================================BODY CHECK=======================================//

    // No body given? Throw an error!
    const { body } = req;
    if (!body || !Object.keys(body).length) {
        return next({status: 400, details:"You didn't include a body in your request! Whoops!"});
    }
    
    // IF we have a given "check" array, we check our body and see which values we DON'T have
    if (check.length) {
        const backEndVerify = []; // Is our backend code typed properly ?
        const missing = [];       // Is our req.body accurate ?
        if (!res.locals.valid) res.locals.valid = {};    // Setting up our valid object to send off
        check.forEach(prop => {
            if (typeof prop != "string") {
                backEndVerify.push(prop);
            } else if (!body[prop]) {
                missing.push(prop)
            } else {
                res.locals.valid[prop] = body[prop]
            }
        })

    //==========================BACK_END DEVELOPER CHECKS===============================//
   
        // We should only have strings in our "check" array because we're going to use bracket notation
        //      ( obj[var] ). Ergo, we need "check" to only be an array of strings.
        //      If "backEndVerify" has any values, then something ISN'T a string, and we throw an error.
        if (backEndVerify.length) {
            const error = {
                devMessage: "Back end code error: names for each body property should be a string!",
                source: "middleware: bodyValidator",
                params: backEndVerify.join(", ")
            }
            return next(error);
        }
        
    //================================REQ.BODY CHECK=====================================//

        // All variables required?
        // If our missing array has anything, throw a 400
        if (allRequired && missing.length) {
                return next({
                    status: 400,
                    details:`Oops! You're missing some things for this request!`,
                    params: missing.join(", ")
                });

        // NOT All variables required? Well, we at least need one thing!
        // If we're missing EVERYTHING from our check array, throw a 400
        } else if (missing.length === check.length) {
                return next({
                    status: 400,
                    details:`Oops! You need at least one of these things for this request!`,
                    params: missing.join(", ")
                });
            }
    };
    next();
}