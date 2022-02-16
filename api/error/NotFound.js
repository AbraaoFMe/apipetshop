class NotFound extends Error {
    constructor (entidade, id = '') {
        super(`${entidade} ${id} não foi encontrado!`)
        this.name = 'NotFound'
        this.idError = 0
    }
}

module.exports = NotFound