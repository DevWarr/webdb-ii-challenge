const db = require("../data/dbConfig");

const findAll = () => {
    return db("cars");
}

const findById = (id) => {
    return db("cars")
            .where({ id })
            .first();
}

const findByVIN = (VIN) => {
    return db("cars")
            .where({ VIN })
            .first();
}

const insert = async (newCar) => {

    const [id] = await db("cars")
                        // .returning("id")
                        .insert(newCar)
    if (id) {
        return findById(id);
    } else throw "We were unable to add this car?"

}

const update = async (id, changes) => {

    const success = await db("cars")
                            .where({ id })
                            .update(changes)

    if (success) {
        return findById(id)
    } else throw "We were unable to update this car?"
}

const remove = (id) => {
    return db("cars")
            .where({ id })
            .del();
}


module.exports = {
    findAll,
    findById,
    findByVIN,
    insert,
    update,
    remove
}