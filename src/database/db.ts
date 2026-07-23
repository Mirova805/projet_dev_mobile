import { openDatabaseAsync } from 'expo-sqlite';

// Ouvre la base de données de manière asynchrone
export const db = openDatabaseAsync('enseignants.db');

export const initDB = async () => {
  const database = await db;
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS ENSEIGNANT (
      idens INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      datenais TEXT NOT NULL,
      photo TEXT
    );
  `);
};