const router = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const req = require('express/lib/request')
const Serializer = require('../../../Serializer').SerializerProduto

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.end()
})

router.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)

    const serializer = new Serializer(
        res.getHeader('Content-Type')
    )

    res.send(
        serializer.serialize(produtos)
    )
})

router.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)

        await produto.criar()

        const serializer = new Serializer(
            res.getHeader('Content-Type')
        )

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Etag', produto.versao)
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/forncedores/${produto.fornecedor}/produtos/${produto.id}`)

        res.status(201)
        res.send(
            serializer.serialize(produto)
        )

    } catch (error) {
        next(error)
    }

})

router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, DELETE, HEAD, PUT')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.end()
})

router.delete('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados)
        await produto.apagar()

        res.status(204)
        res.end()
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados)
        await produto.carregar()

        const serializer = new Serializer(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Etag', produto.versao)
        res.set('Last-Modified', timestamp)

        res.status(200)
        res.send(
            serializer.serialize(produto)
        )

    } catch (error) {
        next(error)
    }

})

router.head('/:id', async (re, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados)
        await produto.carregar()


        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Etag', produto.versao)
        res.set('Last-Modified', timestamp)

        res.status(200)
        res.end()
 
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const dados = Object.assign(
            {},
            req.body,
            {
                id: req.params.id,
                fornecedor: req.fornecedor.id,
            }
        )

        const produto = new Produto(dados)

        await produto.atualizar()
        await produto.carregar()

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Etag', produto.versao)
        res.set('Last-Modified', timestamp)

        res.status(204)
        res.end()

    } catch (error) {
        next(error)
    }

})

router.options('/:id/diminuir-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.end()
})

router.post('/:id/diminuir-estoque', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id,
            quantidade: req.body.quantidade
        }

        if (!dados.quantidade || dados.quantidade <= 0) {
            throw new Error('O campo quantidade está invalido')
        }

        const produto = new Produto(dados)

        await produto.carregar()

        if (produto.estoque <= dados.quantidade) {
            throw new Error('Não há estoque suficiente')
        }

        await produto.diminuirEstoque(dados.quantidade)
        await produto.carregar()


        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Etag', produto.versao)
        res.set('Last-Modified', timestamp)

        res.status(204)
        res.end()
    } catch (error) {
        next(error)
    }
})

module.exports = router