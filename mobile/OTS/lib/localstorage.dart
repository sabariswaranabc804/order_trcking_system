import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  DatabaseHelper._internal();

  factory DatabaseHelper() {
    return _instance;
  }

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'your_database_name.db');
    print("Database path: $path"); // Log the database path
    return await openDatabase(
      path,
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE cart(id INTEGER PRIMARY KEY AUTOINCREMENT, servSubType_Name TEXT, serv_Name TEXT, quantity INTEGER, rate REAL, imagefile TEXT)',
        );
      },
      version: 1,
    );
  }

  Future<void> removeCartItem(int id) async {
    final db = await database;
    await db.delete('cart', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> clearCart() async {
    final db = await database;
    await db.delete('cart'); // Assuming 'cart' is the table name
  }

  Future<Map<String, dynamic>?> getCartItemByServiceName(
      String serviceName) async {
    final db = await database;
    List<Map<String, dynamic>> results = await db.query(
      'cart',
      where: 'servSubType_Name = ?',
      whereArgs: [serviceName],
    );
    if (results.isNotEmpty) {
      return results.first; // Return the first matching item
    }
    return null; // No item found
  }

  Future<void> insertCartItem(Map<String, dynamic> item) async {
    final db = await database;
    await db.insert('cart', item);
  }

  Future<List<Map<String, dynamic>>> getCartItems() async {
    final db = await database;
    return await db.query('cart');
  }

  Future<void> updateCartItem(Map<String, dynamic> item) async {
    final db = await database;
    await db.update(
      'cart',
      item,
      where: 'id = ?',
      whereArgs: [item['id']],
    );
  }

  Future<void> deleteCartItem(int id) async {
    final db = await database;
    await db.delete(
      'cart',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> updateFavoriteStatus(int id, bool isFavorite) async {
    final db = await database;
    await db.update(
      'cartItems',
      {'isFavorite': isFavorite ? 1 : 0}, // Toggle favorite status
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<Database> _initDb() async {
    String path = join(await getDatabasesPath(), 'cart.db');
    return await openDatabase(
      path,
      version: 2, // Increment the version number to trigger the upgrade
      onCreate: (db, version) async {
        // Create table with the new 'serv_Name' column
        await db.execute('''
          CREATE TABLE cartItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            servSubType_Name TEXT,
            serv_Name TEXT, -- New column
            quantity INTEGER,
            rate REAL,
            imagefile TEXT,
            isFavorite INTEGER
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          // Perform table migration when upgrading to version 2
          await db.execute('''
            CREATE TABLE cartItems_new (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              servSubType_Name TEXT,
              serv_Name TEXT, -- New column
              quantity INTEGER,
              rate REAL,
              imagefile TEXT,
              isFavorite INTEGER
            )
          ''');

          // Copy data from old table to new table
          await db.execute('''
            INSERT INTO cartItems_new (id, servSubType_Name, quantity, rate, imagefile, isFavorite,serv_Name)
            SELECT id, servSubType_Name, quantity, rate, imagefile, isFavorite,serv_Name
            FROM cartItems
          ''');

          // Drop the old table
          await db.execute('DROP TABLE cartItems');

          // Rename the new table to the old table name
          await db.execute('ALTER TABLE cartItems_new RENAME TO cartItems');
        }
      },
    );
  }
}
