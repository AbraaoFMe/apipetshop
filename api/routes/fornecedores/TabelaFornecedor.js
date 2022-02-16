const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
    listar() {
        return Modelo.findAll({raw: true})
    },

    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },

    pegarPorId(id) {
        return Modelo.findOne({
            where: {
                id: id
            }
        })
    },

    atualizar(id, newData) {
        return Modelo.update(
            newData,
            {
                where: {
                    id: id
                }
            }
        )
    },

    remover(id) {
        return Modelo.destroy({
            where: { id: id }
        })
    }

}