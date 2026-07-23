import { db } from './db';

// Interface TypeScript pour un Enseignant
export interface Enseignant {
  idens: number;
  nom: string;
  datenais: string;
  photo: string | null;
}

// Ajouter
export const insertEnseignant = async (nom: string, datenais: string, photo: string | null) => {
  const database = await db;
  const result = await database.runAsync(
    'INSERT INTO ENSEIGNANT (nom, datenais, photo) VALUES (?, ?, ?);',
    [nom, datenais, photo]
  );
  return result.lastInsertRowId;
};

// Obtenir tous
export const getAllEnseignants = async (): Promise<Enseignant[]> => {
  const database = await db;
  const result = await database.getAllAsync<Enseignant>(
    'SELECT * FROM ENSEIGNANT ORDER BY nom;'
  );
  return result;
};

// Obtenir un par id
export const getEnseignantById = async (id: number): Promise<Enseignant | undefined> => {
  const database = await db;
  const result = await database.getAllAsync<Enseignant>(
    'SELECT * FROM ENSEIGNANT WHERE idens = ?;',
    [id]
  );
  return result[0];
};

// Mettre à jour
export const updateEnseignant = async (idens: number, nom: string, datenais: string, photo: string | null) => {
  const database = await db;
  await database.runAsync(
    'UPDATE ENSEIGNANT SET nom = ?, datenais = ?, photo = ? WHERE idens = ?;',
    [nom, datenais, photo, idens]
  );
};

// Supprimer
export const deleteEnseignant = async (idens: number) => {
  const database = await db;
  await database.runAsync('DELETE FROM ENSEIGNANT WHERE idens = ?;', [idens]);
};

// Rechercher par nom (contient)
export const searchEnseignants = async (nom: string): Promise<Enseignant[]> => {
  const database = await db;
  const result = await database.getAllAsync<Enseignant>(
    "SELECT * FROM ENSEIGNANT WHERE nom LIKE ? ORDER BY nom;",
    [`%${nom}%`]
  );
  return result;
};