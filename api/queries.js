const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'ovi',
  host: 'localhost',
  database: 'api',
  password: 'parola',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const userId = parseInt(request.params.id);
  pool.query(`SELECT * FROM users WHERE id = ${userId}`, (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { nume, data_nastere } = request.body;

  pool.query(`INSERT INTO users (nume, data_nastere) VALUES ($1, $2)`, [nume, data_nastere], (error, results) => {
    if (error) throw error;
    response.status(201).send(`Userul cu numele "${nume}" a fost adaugat.`);
  });
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(`DELETE FROM users WHERE id = $1`, [id], (error, results) => {
    if (error) throw error;
    response.status(200).send(`Userul cu ID-ul ${id} a fost sters.`);
  });
};

const getFriends = (request, response) => {
  const ownerId = parseInt(request.params.id);
  pool.query(
    `SELECT * FROM users U
    LEFT JOIN prietenie F
    ON U.id = F.persoana_b
    WHERE F.persoana_a = ${ownerId}
    UNION
    SELECT * FROM users U
    LEFT JOIN prietenie F
    ON U.id = F.persoana_a
    WHERE F.persoana_b = ${ownerId}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const addFriend = (request, response) => {
  const ownerId = parseInt(request.params.id);
  const { id_prieten } = request.body;

  pool.query(`INSERT INTO prietenie (persoana_a, persoana_b) VALUES (${ownerId}, ${id_prieten})`, (error, results) => {
    if (error) {
      if (error.message.includes('duplicate')) {
        response.send('Userii sunt deja prieteni');
      }
      throw error;
    }
    response.status(201).send(`Userii cu ID-urile ${ownerId} si ${id_prieten} sunt acum prieteni!`);
  });
};

const deleteFriend = (request, response) => {
  const ownerId = parseInt(request.params.id);
  const friendId = parseInt(request.params.fid);

  pool.query(
    `DELETE FROM prietenie WHERE (persoana_a = ${ownerId} AND persoana_b = ${friendId}) OR (persoana_a = ${friendId} AND persoana_b = ${ownerId})`,
    (error, results) => {
      if (error) throw error;
      response.status(200).send(`Userii cu ID-urile ${ownerId} si ${friendId} nu mai sunt prieteni.`);
    }
  );
};

module.exports = {
  getUsers,
  getFriends,
  getUserById,
  createUser,
  addFriend,
  deleteUser,
  deleteFriend,
};
