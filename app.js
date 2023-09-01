const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3001
const formData = require("express-form-data")
const fs = require("fs")


const connection = mysql.createConnection({
  host : 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
  user : 'aluno',
  password : 'alunoc3f3t',
  database : 'aulas_web'
});

app.get('/', (req, res) => {
  res.send("Backend Carlos Brites Rodando...");
});

app.get('/', (req, res) => {
  res.send(moment().format("YYYY-MM-DD"))
})

app.get('/clientes', (req, res) => {
  connection.query(
    'select * from cliente',
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
})

app.get('/clientes/:id_cliente', (req, res) => {
  var id_cliente = req.params.id_cliente 
  connection.query(
    `select * from cliente where id_cliente = ${id_cliente}`,
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
})

app.get('/clientes_email/:email', (req, res) => {
  var email = req.params.email 
  var sql =  `select * from cliente where email = "${email}"`
  connection.query(
    sql,
    (err, results, fields) => {
      if(err) console.log(err)
      console.log(results)
      if(results.length > 0) res.send({existe : true})
      else res.send({existe : false})
    }
  );
})

app.post('/clientes_del/:id_cliente', (req, res) => {
  var id_cliente = req.params.id_cliente 
  connection.query(
    `delete from cliente where id_cliente = ${id_cliente}`,
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
})

app.post('/clientes',  (req, res) => {
  var nome = req.body.nome
  var sobrenome = req.body.sobrenome
  var email = req.body.email
  var data_cadastro = moment().format("YYYY-MM-DD")
  var salario = req.body.salario
  console.log(req.files)
  var sql = `insert into cliente(nome, sobrenome, email, `+
        `data_cadastro,salario) values("${nome}", "${sobrenome}", `+
        `"${email}", "${data_cadastro}", ${salario})`
   connection.query(sql, (erro, resultado) =>{
      if(erro) res.send(erro)
      var caminhoTemp = req.files.avatar.path
      var caminhoNovo = `./uploads/clientes/${resultado.insertId}.png`
      fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
        console.log(err)
        res.send(resultado)
      })
      
   })
})

app.patch('/clientes/:id_cliente', (req, res) => {
  var sql = `update cliente set nome = "JoaoAula", `+
    `sobrenome = "SilvaAula", email = "outro@outro.com", `+
    `salario = 2500 where id_cliente = 56`
   connection.query(sql, (erro, resultado) =>{
      if(erro) res.send(erro)
      res.send(resultado)
   })
})

app.get('/fornecedor', (req, res) => {
  connection.query(
    'select * from fornecedor',
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
});

app.get('/fornecedor/:id_fornecedor?', (req, res) => {
  var id_fornecedor = req.params.id_fornecedor

  connection.query(
    `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
});

app.post('/fornecedor', (req, res) => {
  var razao =  req.body.razao
  var cpf_cnpj =  req.body.cpf_cnpj
  var contato =  req.body.contato
  var logradouro =  req.body.logradouro
  var cidade =  req.body.cidade
  var uf =  req.body.uf
  console.log(req.files)

  var sql = `insert into fornecedor(razao, cpf_cnpj, contato, logradouro, cidade, uf)` +
            `values("${razao}", "${cpf_cnpj}", "${contato}", "${logradouro}", "${cidade}", "${uf}")`
  
  connection.query(sql, (erro, resultado) => {
    if(erro) res.send(erro)
    var caminhoTemp = req.files.logomarca.path
    var caminhoNovo = `./uploads/fornecedor/${resultado.insertId}.png`
    fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
      console.log(err)
      res.send(resultado)
    })
  })
});

app.post('/fornecedor_del/:id_fornecedor?', (req, res) => {
  var id_fornecedor = req.params.id_fornecedor

  connection.query(
    `delete from fornecedor where id_fornecedor = ${id_fornecedor}`,
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
});

app.post('/fornecedor_up/:id_fornecedor?', (req, res) => {
  var id_fornecedor = req.params.id_fornecedor
  var razao =  req.body.razao
  var cpf_cnpj =  req.body.cpf_cnpj
  var contato =  req.body.contato
  var logradouro =  req.body.logradouro
  var cidade =  req.body.cidade
  var uf =  req.body.uf

  var sql = `update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", contato = "${contato}", logradouro = "${logradouro}", cidade = "${cidade}", uf = "${uf}" where id_fornecedor = "${id_fornecedor}"`
  
  connection.query(sql, (erro, resultado) => {
    if(erro) res.send(erro) 
    res.send(resultado)
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

