import mysql from "mysql2/promise";

class DatabaseHelper {
    private conn: mysql.Connection | undefined;

    async init() {
        this.conn = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }

    public async query(sql: string, params: (string | number | undefined)[] = []) {
        if (!this.conn) {
            throw new Error('Database does not exist!');
        }

        return this.conn.execute(sql, params);
    }

    public async select(table: string, rows: string[] = ['*']) {
        const sql = `SELECT ${rows.join()} FROM ${table};`;

        return this.query(sql);
    }
}

export default DatabaseHelper