import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

class DatabaseConnection {
    private db: SqlJsDatabase | null = null;
    private initialized: boolean = false;

    async init() {
        if (this.initialized) return;

        const SQL = await initSqlJs();

        try {
            if (fs.existsSync(dbPath)) {
                const buffer = fs.readFileSync(dbPath);
                this.db = new SQL.Database(buffer);
                console.log(`📁 Database loaded from: ${dbPath}`);
            } else {
                this.db = new SQL.Database();
                console.log(`📁 New database created: ${dbPath}`);
            }
        } catch (error) {
            this.db = new SQL.Database();
            console.log(`📁 New database created: ${dbPath}`);
        }

        this.initialized = true;
    }

    query(sql: string, params: any[] = []) {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }

        try {
            // Replace PostgreSQL-style $1, $2 with SQLite-style ?
            const sqliteSql = sql.replace(/\$(\d+)/g, '?');

            // Handle RETURNING clause (not supported in SQLite)
            let returningSql = sqliteSql;
            let needsReturn = false;
            let tableName = '';

            if (sqliteSql.includes('RETURNING')) {
                needsReturn = true;
                const parts = sqliteSql.split('RETURNING');
                returningSql = parts[0].trim();

                // Extract table name
                const tableMatch = returningSql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
                tableName = tableMatch ? tableMatch[1] : '';
            }

            // Execute the query
            this.db.run(returningSql, params);

            // Handle different query types
            if (returningSql.trim().toUpperCase().startsWith('SELECT')) {
                const result = this.db.exec(returningSql, params);
                if (result.length > 0) {
                    const rows = result[0].values.map(row => {
                        const obj: any = {};
                        result[0].columns.forEach((col, idx) => {
                            obj[col] = row[idx];
                        });
                        return obj;
                    });
                    return { rows, rowCount: rows.length };
                }
                return { rows: [], rowCount: 0 };
            } else if (needsReturn && tableName) {
                // Get the last inserted/updated row
                const lastIdResult = this.db.exec('SELECT last_insert_rowid() as id');

                let rows: any[] = [];
                if (lastIdResult.length > 0 && lastIdResult[0].values.length > 0) {
                    const lastId = lastIdResult[0].values[0][0];

                    // Query the inserted row
                    const result = this.db.exec(`SELECT * FROM ${tableName} WHERE id = ${lastId}`);

                    if (result.length > 0 && result[0].values.length > 0) {
                        const row: any = {};
                        result[0].columns.forEach((col, idx) => {
                            row[col] = result[0].values[0][idx];
                        });
                        rows = [row];
                    }
                }

                // Save after getting the data
                this.saveToFile();
                return { rows, rowCount: rows.length };
            } else {
                const changes = this.db.getRowsModified();
                // Save after modification
                this.saveToFile();
                return { rows: [], rowCount: changes };
            }
        } catch (error) {
            console.error('Database query error:', error);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    private saveToFile() {
        if (!this.db) return;

        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(dbPath, buffer);
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    async getClient() {
        return this.db;
    }

    async close() {
        if (this.db) {
            this.saveToFile();
            this.db.close();
        }
    }
}

export const db = new DatabaseConnection();
export default db;
