class NoDataReceived extends Error {
    constructor() {
        super('Não foram fornecidos dados para atualizar!')
        this.name = 'NoDataReceived'
        this.idError = 2
    }
}

module.exports = NoDataReceived