/**
 * Core video diary data types.
 * All videos are stored in SQLite with these fields.
 */

export interface Video {
  id: number;
  uri: string;
  thumbnailUri: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface VideoInput {
  uri: string;
  thumbnailUri: string;
  name: string;
  description: string;
}

/**
 * Type used during the add video wizard flow.
 */
export interface VideoCreationData {
  sourceUri: string;
  startTime: number;
  endTime: number;
  name: string;
  description: string;
}
