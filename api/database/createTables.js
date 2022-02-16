const modelos = [
    require('../routes/fornecedores/ModeloTabelaFornecedor'),
    require('../routes/fornecedores/produtos/ModeloTabelaProduto')
]


async function criarTabelas() {
    modelos.forEach(async modelo => {
        await modelo.sync()
    })
}

criarTabelas()