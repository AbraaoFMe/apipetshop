const config = require('config')
const jsontoxml = require('jsontoxml')
const ContentTypeNotSupported = require('./error/ContentTypeNotSupported')

class Serializer {
    json(data) {
        return JSON.stringify(data)
    }
    
    xml(data) {
        let tag = this.tagSingular

        if(Array.isArray(data)) {
            tag = this.tagPlural
            data = data.map(item => {
                return {
                    [this.tagSingular]: item
                }
            })
        }
        return jsontoxml({ [tag]: data })
    }
    
    verifyContentType() {
        switch (this.contentType) {
            case 'application/json':
                return this.json
                
                case 'application/xml':
                    return this.xml
                    
                    default:
                        throw new ContentTypeNotSupported(this.contentType)
                    }
    }

    serialize(data) {
        this.serializeMethod = this.verifyContentType()

        return this.serializeMethod(this.filtrar(data))
    }

    filtrarObjeto(data) {
        const novoObjeto = {}

        this.camposPublicos.forEach(campo => {
            if (data.hasOwnProperty(campo)) {
                novoObjeto[campo] = data[campo]
            }
        })

        return novoObjeto
    }

    filtrar(data) {
        if (Array.isArray(data)) {
            data = data.map(item => this.filtrarObjeto(item))
        } else {
            data = this.filtrarObjeto(data)
        }

        return data
    }
}

class SerializerFornecedor extends Serializer {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id'
        ].concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializerError extends Serializer {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'error'
        ].concat(camposExtras || [])
        this.tagSingular = 'error'
        this.tagPlural = 'errors'
    }
}

class SerializerProduto extends Serializer {
    constructor(contentType, camposExtras) {
        super()

        this.contentType = contentType
        this.camposPublicos = [
            'id', 
            'titulo'
        ].concat(camposExtras || [])

        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
    }
}

module.exports = {
    Serializer: Serializer,
    SerializerFornecedor: SerializerFornecedor,
    SerializerError: SerializerError,
    SerializerProduto: SerializerProduto,
    acceptedContentType: config.get('api.acceptedContentType')
}