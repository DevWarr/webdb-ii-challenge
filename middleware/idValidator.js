/**
 * `idValidator`.
 * 
 * Checks a given database for a specific id.
 * 
 * If an entry exists in the 
 * database with the given id, it will be saved on the `res.locals` object.
 * The property name will be the same name given to this function. Example:
 * 
 * `"entry_id"` -> `res.locals.entry` OR `"user_id"` -> `res.locals.user`
 * 
 * @param {object} db The database to check to confirm this id is valid
 * 
 * @param {string} entry_id The name of the id variable to check
 */
module.exports = (db, entry_id) => (req, res, next) => {
    

    //==========================BACK_END DEVELOPER CHECKS===============================//

    // When setting up back_end code, "entry_id" SHOULD be a string:
    if (!entry_id || typeof entry_id !== "string" || !entry_id instanceof String) {
        const error = {
            devMessage: "Back end code error: names for each req.params should be a string!",
            source: "middleware: idValidator"
        }
        return next(error);
    }

    // If the naming convention has not been followed:
    if (entry_id.substring(entry_id.length - 3) !== "_id") {
        const error = {
            devMessage: "Back end code error: Please follow the naming convention 'entry_id'!",
            source: "middleware: idValidator"
        }
        return next(error);
    }

    //==================================REQ CHECKS=======================================//
    
    const id = req.params[entry_id];
    // If the params given are not a number
    if (!id || isNaN(Number(id))) {
        const error = {
            status: 400,
            details: "Please give a valid id!",
            params: entry_id
        }
        return next(error);
    }
    
    //===================================DB CHECKS========================================//

    db.findById(id)
        .then(entry => {
            if (entry) {
                const entry_name = entry_id.substring(0, entry_id.length-3);
                res.locals[entry_name] = entry;
                next();
            } else {
                const error = {
                    status: 404,
                    details: "We could not find an entry with this id.",
                    params: entry_id
                }
                next(error);
            }
        })
        .catch(err => {
            next({devMessage: err.toString()});
        })
}