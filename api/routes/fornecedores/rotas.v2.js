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
        ['categoria']
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
            res.getHeader('Content-Type')
        )

        res.send(serializer.serialize(fornecedor))
    } catch (error) {
        next(error)
    }

})

module.exports = router