const seedData = [
    {
        VIN: "1230985098GF",
        make: "Hyundai",
        model: "Elantra",
        mileage: 48000
    },
    {
        VIN: "4098FDJ43432",
        make: "Ford",
        model: "Focus",
        mileage: 120000
    },
    {
        VIN: "123",
        make: "Dodge",
        model: "Charger",
        mileage: 0
    },
    {
        VIN: "1111111GGGFHH",
        make: "Ford",
        model: "F-150",
        mileage: 84810
    },
]

exports.seed = knex => {
    return knex("cars")
        .truncate()
        .then(() => knex("cars").insert(seedData))
}