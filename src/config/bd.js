const sql = require("mysql2")

const mysql = sql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "aluno123",
    database: "Jacaridade"
});

mysql.connect((erro) => {
    if (erro) {
        console.log("Deu ruim " + erro)
    }
    else console.log("Banco Conectado")
});

module.exports = mysql;