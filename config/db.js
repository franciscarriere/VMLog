// Set the connection string based from the config vars of the production server
// To run locally use 'mongodb://localhost/vmlog' instead of process.env.DB

module.exports = {
  db: 'mongodb://localhost/vmlog'
};
