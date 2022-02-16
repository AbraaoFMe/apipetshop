class ContentTypeNotSupported extends Error {
    constructor(contentType) {
        super(`O tipo de conteúdo ${contentType} não é suportado.`)
        this.name = 'ContentTypeNotSupported'
        this.idError = 3
    }
}

module.exports = ContentTypeNotSupported