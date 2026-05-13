const Sequelize = require("sequelize");

const conn = new Sequelize ("Jacaridade", "root", "aluno123", {
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
        timestamps: false
  }
})

conn.authenticate()
.then(() => {
    console.log("Banco conectado")
})
.catch(() => {
    console.log("Banco não conectado")
})

module.exports = conn;