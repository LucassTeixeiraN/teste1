const Sequelize = require('sequelize');
const db = require('../config/bd_Sequelize');
const cripto = require('bcrypt');

const Ong = db.define('cadastroOng', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categoria: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipo_conta: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Ong.sync();

const TodosOng = () => Ong.findAll({
    where: { tipo_conta: 'ong' }
});

const addOng = async (params) => {
    const senha_cripto = await cripto.hash(params.senha, 8);
    params.senha = senha_cripto;
    const resultado = await Ong.create(params);
    return resultado;
};

const buscar_nome = async (nome) => await Ong.findOne({
    where: { nome }
});

const atualizarOng = async(params) => {
    const senha_cripto = await cripto.hash(params.senha, 8);
    return await Ong.update(
        {
            senha: senha_cripto,
            email: params.email,
            nome: params.nome
        },
        {
            where: {
                nome: params.nome
            }
        }
    );
};

const deleteOng = async(id) => {
    await Ong.destroy({
        where: {
            id
        }
    });
};

const login = async(params) => {
    return await Ong.findOne({
        where: { email: params.email }
    });
};

const validacao = (senha, senha_cripto) => cripto.compare(senha, senha_cripto);

module.exports = { TodosOng, addOng, buscar_nome, deleteOng, atualizarOng, login, validacao, Ong };
