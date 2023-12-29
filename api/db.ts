import * as SQLite from 'expo-sqlite'

const DB_NAME = 'bgt'

let db: SQLite.SQLiteDatabase | null = null
export function getDB(): SQLite.SQLiteDatabase {
  if (db === null) {
    db = SQLite.openDatabase(DB_NAME)
  }
  return db
}
