const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/bd_Sequelize");
const cripto = require("bcrypt");

const User = db.define('User', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_conta: {
        type: DataTypes.STRING,
        defaultValue: "doador"
    },
    interesses: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

User.beforeCreate(async (user) => {
    user.senha = await cripto.hash(user.senha, 8);
});

User.sync();


const addUser = async (params) => 
    await User.create(params);

const loginUser = async (email) => 
    await User.findOne({ where: { email } });

const validarSenha = (senha, hash) => 
    cripto.compare(senha, hash);

module.exports = { User, addUser, loginUser, validarSenha };