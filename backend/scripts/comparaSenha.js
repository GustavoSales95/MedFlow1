import bcrypt from "bcryptjs";

const hash = '$2b$10$oRXcDb9AXulIxFjRAVkai.EF5LupXmY9RlSMIUtw4TYq/Zw8mdUkC';
const senhaDigitada = "123123123"; // troque pela senha que está tentando

bcrypt.compare(senhaDigitada, hash).then(console.log); // Deve imprimir true ou false
