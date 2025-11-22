import type { Video, VideoInput } from '@/types';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = process.env.EXPO_PUBLIC_DB_NAME || 'videodiary.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the SQLite database and create the videos table if it doesn't exist.
 * This should be called once when the app starts (in _layout.tsx).
 */
export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Create videos table with thumbnailUri for list performance
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        createdAt INTEGER NOT NULL
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get all videos ordered by creation date with optional filtering.
 */
export async function getAllVideos(
  searchQuery: string = '',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<Video[]> {
  if (!db) throw new Error('Database not initialized');

  try {
    const query = `
      SELECT * FROM videos 
      WHERE name LIKE ? 
      ORDER BY createdAt ${sortOrder}
    `;

    const result = await db.getAllAsync<Video>(query, [`%${searchQuery}%`]);
    return result;
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    throw error;
  }
}

/**
 * Get a single video by ID.
 */
export async function getVideoById(id: number): Promise<Video | null> {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.getFirstAsync<Video>(
      'SELECT * FROM videos WHERE id = ?',
      [id]
    );
    return result || null;
  } catch (error) {
    console.error('Failed to fetch video:', error);
    throw error;
  }
}

/**
 * Insert a new video and return its ID.
 * Used after trimming and generating thumbnail.
 */
export async function insertVideo(data: VideoInput): Promise<number> {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.runAsync(
      'INSERT INTO videos (uri, thumbnailUri, name, description, createdAt) VALUES (?, ?, ?, ?, ?)',
      [data.uri, data.thumbnailUri, data.name, data.description, Date.now()]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert video:', error);
    throw error;
  }
}

/**
 * Update video metadata (name and description only).
 */
export async function updateVideo(
  id: number,
  data: { name: string; description: string }
): Promise<boolean> {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.runAsync(
      'UPDATE videos SET name = ?, description = ? WHERE id = ?',
      [data.name, data.description, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Failed to update video:', error);
    throw error;
  }
}

/**
 * Delete a video by ID.
 * Note: This only removes the database entry.
 * File cleanup should be handled separately.
 */
export async function deleteVideo(id: number): Promise<boolean> {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.runAsync('DELETE FROM videos WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Failed to delete video:', error);
    throw error;
  }
}
