const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const { addUser, loginUser, validarSenha } = require('./model/cadastroUser');
const { addOng, login: loginOng, validacao: validarSenhaOng } = require('./model/cadastroOng');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'jacaridade-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
};

app.get('/', (req, res) => {
    res.render('initial');
});

app.get('/home', requireLogin, (req, res) => {
    res.render('home', { nome: req.session.user.nome || 'HackIFSP', tipo: req.session.user.tipo || 'user' });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        req.flash('error', 'Preencha e-mail e senha.');
        return res.redirect('/login');
    }

    try {
        const user = await loginUser(email);

        if (!user || !(await validarSenha(senha, user.senha))) {
            req.flash('error', 'E-mail ou senha inválidos.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo_conta || 'user'
        };

        req.flash('success', 'Login efetuado com sucesso.');
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao processar login. Tente novamente.');
        res.redirect('/login');
    }
});

app.get('/login-ong', (req, res) => {
    res.render('loginOng');
});

app.post('/login-ong', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        req.flash('error', 'Preencha e-mail e senha.');
        return res.redirect('/login-ong');
    }

    try {
        const ong = await loginOng({ email });

        if (!ong || !(await validarSenhaOng(senha, ong.senha))) {
            req.flash('error', 'E-mail ou senha inválidos.');
            return res.redirect('/login-ong');
        }

        req.session.user = {
            id: ong.id,
            nome: ong.nome,
            email: ong.email,
            tipo: 'ong'
        };

        req.flash('success', 'Login de ONG efetuado com sucesso.');
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao processar login da ONG. Tente novamente.');
        res.redirect('/login-ong');
    }
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, interesses } = req.body;

    if (!nome || !email || !senha) {
        req.flash('error', 'Preencha nome, e-mail e senha.');
        return res.redirect('/cadastro');
    }

    try {
        await addUser({ nome, email, senha, interesses });
        req.flash('success', 'Cadastro realizado com sucesso. Faça login.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', 'Este e-mail já está cadastrado.');
        } else {
            req.flash('error', 'Erro ao cadastrar usuário. Tente novamente.');
        }
        res.redirect('/cadastro');
    }
});

app.get('/cadastro-ong', (req, res) => {
    res.render('cadastroOng');
});

app.post('/cadastro-ong', async (req, res) => {
    const { nome, email, senha, categoria, descricao } = req.body;

    if (!nome || !email || !senha || !categoria || !descricao) {
        req.flash('error', 'Preencha todos os campos da ONG.');
        return res.redirect('/cadastro-ong');
    }

    try {
        await addOng({ nome, email, senha, categoria, descricao, tipo_conta: 'ong' });
        req.flash('success', 'Cadastro de ONG realizado com sucesso. Faça login.');
        res.redirect('/login-ong');
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', 'Este e-mail já está cadastrado.');
        } else {
            req.flash('error', 'Erro ao cadastrar ONG. Tente novamente.');
        }
        res.redirect('/cadastro-ong');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = app;
