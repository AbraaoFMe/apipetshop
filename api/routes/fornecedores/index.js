const router = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializerFornecedor = require('../../Serializer').SerializerFornecedor

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.end()
})

router.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()

    res.status(200)
    const serializer = new SerializerFornecedor(
        res.getHeader('Content-Type'),
        ['empresa', 'categoria']
    )

    res.send(serializer.serialize(resultados))
})

router.post('/', async (req, res, next) => {
    try {
        const data = req.body
        const fornecedor = new Fornecedor(data)
        await fornecedor.criar()

        res.status(201)
        const serializer = new SerializerFornecedor(
            res.getHeader('Content-Type'),
            ['empresa', 'categoria']
        )

        res.send(serializer.serialize(fornecedor))
    } catch (error) {
        next(error)
    }

})

router.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.end()
})

router.get('/:idFornecedor', async (req, res, next) => {
    try {
        const idFornecedor = req.params.idFornecedor

        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.carregar()

        res.status(200)
        const serializer = new SerializerFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao', 'categoria']
        )

        res.send(serializer.serialize(fornecedor))

    } catch (error) {
        next(error)
    }
})

router.put('/:idFornecedor', async (req, res, next) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const data = req.body

        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.atualizar(data)

        res.status(204)
        res.end()
    } catch (error) {
        next(error)
    }

})

router.delete('/:idFornecedor', async (req, res, next) => {
    try {
        const idFornecedor = req.params.idFornecedor

        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.remover()

        res.status(204)
        res.end()
    } catch (error) {
        next(error)
    }
})

const ProdutosRouter = require('./produtos')

const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })

        await fornecedor.carregar()
        req.fornecedor = fornecedor
        next()
    } catch (error) {
        next(error)
    }
}

router.use('/:idFornecedor/produtos', verificarFornecedor, ProdutosRouter)

module.exports = router