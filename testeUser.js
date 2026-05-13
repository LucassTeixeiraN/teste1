const { addUser, loginUser, validarSenha } = require('./src/model/cadastroUser');

async function rodarTeste() {
    try {
        console.log("--- Iniciando Teste de Usuário ---");

        // 1. Simulação de Cadastro
        const dadosDoador = {
            nome: "Gabriel Doador",
            email: "gabriel@email.com",
            senha: "senha_segura_123",
            interesses: "Causa Animal, Educação"
        };

        const novoUser = await addUser(dadosDoador);
        console.log("✅ Usuário cadastrado com sucesso:", novoUser.nome);

        // 2. Simulação de Login
        console.log("\n--- Testando Login ---");
        const UserEncontrado = await loginUser("gabriel@email.com");

        if (UserEncontrado) {
            console.log("✅ Usuário encontrado no banco.");

            // 3. Validação de Senha (Bcrypt)
            const senhaValida = await validarSenha("senha_segura_123", UserEncontrado.senha);
            
            if (senhaValida) {
                console.log("✅ Senha validada com sucesso! Acesso permitido.");
            } else {
                console.log("❌ Senha incorreta.");
            }
        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log("⚠️  Aviso: Este e-mail já está cadastrado.");
        } else {
            console.error("❌ Erro no teste:", error);
        }
    }
}

rodarTeste();