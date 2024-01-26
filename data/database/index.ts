import * as SQLite from 'expo-sqlite'

const DB_BGT = 'bgt'

let db: SQLite.SQLiteDatabase | null = null
export function DB(): SQLite.SQLiteDatabase {
  if (db === null) {
    db = SQLite.openDatabase(DB_BGT)
  }
  return db
}
