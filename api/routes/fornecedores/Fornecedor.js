const TabelaFornecedor = require('./TabelaFornecedor')
const InvalidField = require('../../error/InvalidField')
const NotFound = require('../../error/NotFound')
const NoDataReceived = require('../../error/NoDataReceived')


class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa,
            this.email = email,
            this.categoria = categoria,
            this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        this.validar()

        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        const resultado = await TabelaFornecedor.pegarPorId(this.id)

        if (!resultado) {
            throw new NotFound('fornecedor', this.id)
        }

        this.empresa = resultado.empresa
        this.email = resultado.email
        this.categoria = resultado.categoria
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao

    }
    
    async atualizar(dados) {
        await this.carregar()
        
        const campos = ['empresa', 'email', 'categoria']
        const insertData = {}

        campos.forEach(campo => {
            const valor = dados[campo]

            if(typeof valor === 'string' && valor.length > 0) {
                this[campo] = valor
                insertData[campo] = this[campo]
            }
        })

        if(Object.keys(insertData).length === 0) {
            throw new NoDataReceived()
        }

        await TabelaFornecedor.atualizar(this.id, insertData)
    }

    async remover() {
        await this.carregar()

        await TabelaFornecedor.remover(this.id)
    }

    validar() {
        const campos = ['empresa', 'email', 'categoria']

        campos.forEach(campo => {
            const valor = this[campo]

            if(typeof valor !== 'string' || valor.length === 0) {
                throw new InvalidField(campo)
            }
        })
    }
}

module.exports = Fornecedor