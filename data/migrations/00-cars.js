exports.up = knex => {
    return knex.schema.createTable("cars", car => {
        car.increments();
        car.string("VIN")
            .notNullable()
            .unique()
        car.string("make")
            .notNullable()
        car.string("model")
            .notNullable()
        car.integer("mileage")
            .notNullable()
        car.string("transmission")
        car.string("status")
    })
}

exports.down = knex => knex.schema.dropTableIfExists("cars");