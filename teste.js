const { addOng } = require('./src/model/cadastroOng'); // ajuste o caminho se necessário

async function testar() {
    try {
        const novaOng = await addOng({
            nome: "ONG Patinhas",
            categoria: "Animais",
            descricao: "Ajuda cães de rua",
            email: "contato@patinhas.org",
            senha: "123",
            tipo_conta: "ong"
        });
        console.log("ONG criada com sucesso:", novaOng.nome);
    } catch (erro) {
        console.error("Erro no teste:", erro);
    }
}

testar();