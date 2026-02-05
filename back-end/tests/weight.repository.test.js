const weightRepository = require("../src/repositories/WeightRepository");

console.log("=== TEST WeightRepository ===");

const w1 = weightRepository.create({
  id: 1,
  userId: 10,
  value: 70,
  date: "2026-02-01"
});

const w2 = weightRepository.create({
  id: 2,
  userId: 10,
  value: 72,
  date: "2026-02-02"
});

console.log("Création OK :", w1, w2);

console.log("FindById(1):", weightRepository.findById(1));

console.log(
  "FindByUserId(10):",
  weightRepository.findByUserId(10)
);

console.log(
  "Update(1):",
  weightRepository.update(1, { value: 71 })
);

console.log(
  "Delete(2):",
  weightRepository.delete(2)
);

console.log(
  "FindAll:",
  weightRepository.findAll()
);
