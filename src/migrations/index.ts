import * as migration_20261015_172418_initial from './20261015_172418_initial';
import * as migration_20261025_150026_media_blob_object_key from './20261025_150026_media_blob_object_key';

export const migrations = [
  {
    up: migration_20261015_172418_initial.up,
    down: migration_20261015_172418_initial.down,
    name: '20261015_172418_initial',
  },
  {
    up: migration_20261025_150026_media_blob_object_key.up,
    down: migration_20261025_150026_media_blob_object_key.down,
    name: '20261025_150026_media_blob_object_key'
  },
];
