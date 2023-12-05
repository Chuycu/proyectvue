const Conexión = require('./Conexion');

class Consultas extends Conexión {
    constructor(host, user, pass, db) {
        super(host, user, pass, db)
    }

    async selectUsers(table){
        this.connection = await this.connect();
        const [rows,fields ] = await this.connection.execute(`SELECT * FROM ${table}`)
        return rows
    }

    async selectFechaId(id_documento,fechaid){
        this.connection = await this.connect();
        const [rows,fields] = await this.connection.execute(`SELECT id_cita FROM citas WHERE id_usuario = ${id_documento} AND dia_cita = '${fechaid}';`)
        return rows
    }

    async select(table1,table2) {
        this.connection = await this.connect();
        const [rows, fields] = await this.connection.execute(`SELECT usuarios.nombre, usuarios.id_documento, citas.dia_cita, citas.caso, citas.id_cita FROM ${table1} JOIN ${table2} ON usuarios.id_documento = citas.id_usuario ` );
        return rows
    }

    async delete(table, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`DELETE FROM ${table} WHERE id_cita = ${condition}`)
        return rows
    }

    async insert(table, values) {
        this.connection = await this.connect()
        const [rows, fields] = await this.connection.execute(`INSERT INTO ${table}  ${values}`);
        return rows;
    }

    async update(table, values, condition) {
        const connection = await this.connect()
        const [rows, fields] = await connection.execute(`UPDATE ${table} SET  ${values}  WHERE ${condition}`);
        return rows
    }

    async closeConections(){
        this.connection = await this.connect();
        this.connection = await this.closeConection();
    }
}

module.exports = Consultas;