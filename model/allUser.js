const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  usuario: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },

  dpi: {
    type: Number,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  numeroTelefono: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  nombreTrabajo: {
    type: String,
    required: true,
  },
  ingresos: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const users = new mongoose.model("user", UserSchema);

module.exports = users;
