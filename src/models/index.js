import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

const sequelizeOptions = {
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize = (() => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, sequelizeOptions);
  } else {
    // Specify the connection parameters using environment variables. A list
    // is available at https://www.postgresql.org/docs/12/libpq-envars.html.
    // Common options: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE.
    return new Sequelize({
      ...sequelizeOptions,

      // The following variables are ignored by node-postgres, hence we have
      // to specify them here.
      host: process.env.PGHOST,
      port: process.env.PGPORT,
    });
  }
})();

const models = {
  Asset: sequelize.import('./asset'),
  Attachment: sequelize.import('./attachment'),
  Entity: sequelize.import('./entity'),
  Message: sequelize.import('./message'),
  Report: sequelize.import('./report'),
  Response: sequelize.import('./response'),
  Topic: sequelize.import('./topic'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
