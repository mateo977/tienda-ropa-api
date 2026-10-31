require('dotenv').config({ quiet: true });
const mysql = require('mysql');

// Los datos de conexion vienen de las variables de entorno (archivo .env o panel del hosting)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    // Muchas bases en la nube exigen conexion segura: DB_SSL=true
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Error de conexion MySQL: " + err.message);
        return;
    }
    console.log("Conexion MySQL exitosa");
    connection.release();
});

module.exports = db;
