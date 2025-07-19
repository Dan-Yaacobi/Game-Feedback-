const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bugtracker',
  password: '#######',
  port: 5432
})

async function getAllReports(){
    const result = await pool.query('SELECT * FROM bug_report ORDER BY id ASC');
    return result.rows;
}
async function saveReport(title,description, tags){
    const result = await pool.query('INSERT INTO bug_report (title, description, tags) VALUES ($1,$2,$3) RETURNING *',[title,description,tags]);
    return result.rows[0]
}
async function deleteReport(id) {
    const result = await pool.query('DELETE FROM bug_report WHERE id = $1 RETURNING*',[id])
    return result.rows[0] || null;
}

module.exports = {
    getAllReports,
    saveReport,
    deleteReport
}
