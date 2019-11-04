const express = require("express")
const carsQuery = require("./carsQuery");
const idValidator = require("../middleware/idValidator");
const bodyValidator = require("../middleware/bodyValidator");

const router = express.Router();

router.get("/", (req, res, next) => {
    carsQuery.findAll()
        .then( cars => res.status(200).json(cars) )
        .catch( err => next({ devMessage: err.toString() }) )
})

router.post("/",
            bodyValidator(["VIN", "make", "model", "mileage"]),
            bodyValidator(["mileage", "transmission", "status"], false),
            (req, res, next) => {

    const newCar = res.locals.valid;
    
    carsQuery.findByVIN(newCar.VIN)
        .then(existingCar => {
            if (existingCar) {
                next({ status: 400, details: "A Car with this VIN already exists." });
            } else return;
        })
        .then(() => carsQuery.insert(newCar))
        .then( car => res.status(200).json(car) )
        .catch( err => next({ devMessage: err.toString() }) )
})

router.get("/:car_id", idValidator(carsQuery, "car_id"), (req, res, next) => {
    res.status(200).json(res.locals.car);
})

router.put("/:car_id",
            idValidator(carsQuery, "car_id"),
            bodyValidator(["VIN", "make", "model", "mileage", "transmission", "status"], false),
            (req, res, next) => {

    const { valid: updatedCar, car: currentCar } = res.locals;

    carsQuery.findByVIN(updatedCar.VIN)
        .then(existingCar => {
            if (existingCar && existingCar.id !== currentCar.id) {
                next({ status: 400, details: "A Car with this VIN already exists." });
            } else return;
        })
        .then(() => carsQuery.update(currentCar.id, updatedCar))
        .then( car => res.status(200).json(car) )
        .catch( err => next({ devMessage: err.toString() }) )
})

router.delete("/:car_id", idValidator(carsQuery, "car_id"), (req, res, next) => {
    carsQuery.remove(req.params.car_id)
        .then( () => res.sendStatus(204) )
        .catch( err => next({ devMessage: err.toString() }) )
})

module.exports = router;