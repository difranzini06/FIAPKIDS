const mongoose = require ("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")

const app = express ()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/fiapkids',
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
})


const UsuarioSchema =  new mongoose.Schema({
    nome : { type :String},
    email : {type : String, required : true},
    senha : {type : String}
})


const Usuario = mongoose.model("Usuario", UsuarioSchema)



app.post("/cadastrousuario", async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if ( nome == "" || email == "" || senha == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const emailexiste = await Usuario.findOne({email:email})
    if(emailexiste){
        return res.status(400).json({error:"o email cadastrado já existe"})
    }

    const usuario = new Usuario({
        nome : nome,
        email: email,
        senha:senha,
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newUsuario._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})


// MODEL DE PRODUTOS



const ProdutoSchema =  new mongoose.Schema({
    
    codigo : {type : String, required : true},
    descricao : {type : String},
    fornecedor : { type :String},
    dataFabricacao : { type :Date},
    quantidadeEstoque : { type :Number}
})


const Produto = mongoose.model("Produto", ProdutoSchema)



app.post("/cadastroproduto", async(req,res)=>{
    const codigo = req.body.codigo
    const descricao = req.body.descricao
    const fornecedor = req.body.fornecedor
    const dataFabricacao = req.body.dataFabricacao
    const quantidadeEstoque = req.body.quantidadeEstoque

    if ( codigo == "" || descricao == "" || fornecedor == "" || dataFabricacao == "" || quantidadeEstoque == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const codigoexiste = await Produto.findOne({codigo:codigo})
    if(codigoexiste){
        return res.status(400).json({error:"este código já foi usado"})
    }


    const produto = new Produto({
        codigo: codigo,
        descricao: descricao,
        fornecedor: fornecedor,
        dataFabricacao: dataFabricacao,
        quantidadeEstoque: quantidadeEstoque,
    })

    try{
        const newProduto = await produto.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newProduto._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})


app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroproduto", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroproduto.html");
})


app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})