import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = process.env.RENDER_DATABASE || "";
const username = process.env.RENDER_USERNAME || "";
const password = process.env.RENDER_PASSWORD || "";
const host = process.env.RENDER_HOST || "";
const port = parseInt(process.env.RENDER_PORT as string) || 1234;

const sequelize = new Sequelize(database, username, password, {
  dialect: "postgres",
  dialectModule: require("pg"),
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  host: host,
  port: port,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  logging: false,
});

export default sequelize;
