const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_URL } = process.env;

export const usePartsConfig = Boolean(DB_HOST);

export const pgPoolConfig = usePartsConfig
  ? {
    host: DB_HOST, port: Number(DB_PORT) || 5432, user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  }
  : { connectionString: DB_URL };