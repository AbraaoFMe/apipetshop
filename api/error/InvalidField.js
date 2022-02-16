class InvalidField extends Error {
    constructor(campo) {
        super(`O campo '${campo}' está inválido`)

        this.name = 'InvalidField'
        this.idError = 1
    }
}

module.exports = InvalidField