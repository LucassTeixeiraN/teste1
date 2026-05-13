const model = require("../model/cadastroUser");

class UserController {
    
    // Renderiza a página de login
    async loginPage(req, res) {
        res.render("login", { erro: null });
    }

    // Renderiza a página de cadastro
    async cadastroPage(req, res) {
        res.render("cadastro", { erro: null });
    }

    // Processa o Login
    async autenticar(req, res) {
        const { email, senha } = req.body;
        try {
            const user = await model.loginUser(email);
            
            // Verifica se o usuário existe e se a senha bate
            if (user && await model.validarSenha(senha, user.senha)) {
                // Aqui você pode salvar o usuário na sessão futuramente
                return res.redirect("/dashboard");
            }
            
            res.render("login", { erro: "E-mail ou senha incorretos." });
        } catch (error) {
            res.render("login", { erro: "Erro ao tentar realizar o login." });
        }
    }

    // Processa o Cadastro de Usuário
    async cadastrar(req, res) {
        const { nome, email, senha, interesses } = req.body;
        
        try {
            // Verifica se o e-mail já existe
            const emailExiste = await model.loginUser(email);
            if (emailExiste) {
                return res.render("cadastro", { erro: "Este e-mail já está em uso." });
            }

            // Cria o Usuário (o hook no model cuida da senha)
            await model.addUser({
                nome,
                email,
                senha,
                interesses,
                tipo_conta: "doador"
            });

            // Após cadastrar, manda para o login
            res.redirect("/login");
        } catch (error) {
            console.error(error);
            res.render("cadastro", { erro: "Erro ao realizar cadastro. Tente novamente." });
        }
    }

    // Logout
    async sair(req, res) {
        // Se usar express-session: req.session.destroy();
        res.redirect("/login");
    }
}

module.exports = new UserController();