const paginaInicial = (req, res) => {
    res.render("home", { nome: "HackIFSP" });
};

module.exports = {
   paginaInicial
};