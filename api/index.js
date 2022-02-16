const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const router = require('./routes/fornecedores')
const routerV2 = require('./routes/fornecedores/rotas.v2')

const NotFound = require('./error/NotFound')
const InvalidField = require('./error/InvalidField')
const NoDataReceived = require('./error/NoDataReceived')
const ContentTypeNotSupported = require('./error/ContentTypeNotSupported')

const SerializerError = require('./Serializer').SerializerError

const acceptedContentType = require('./Serializer').acceptedContentType


app.use(bodyParser.json())

app.use((req, res, next) => {
    let contentType = req.header('Accept')

    if(contentType === '*/*') {
        contentType = 'application/json'
    }

    if(acceptedContentType.indexOf(contentType) === -1) {
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-type', contentType)
    res.set('X-Powered-By', 'Gatito Petshop')
    next()
})

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')

    next()
})

app.use('/api/fornecedores', router)

app.use('/api/v2/fornecedores', routerV2)

app.use((error, req, res, next) => {
    let status = 500

    if (error instanceof NotFound) {
        status = 404
    }

    if (error instanceof InvalidField || error instanceof NoDataReceived) {
        status = 400
    }

    if(error instanceof ContentTypeNotSupported) {
        status = 406
    }
   
    const serializer = new SerializerError(
        res.getHeader('Content-Type')
    )

    res.status(status)
    res.send(serializer.serialize({
        error: error.message,
        id: error.idError
    }))
})

app.listen(config.get('api.port'), () => console.log('API RODANDO'))