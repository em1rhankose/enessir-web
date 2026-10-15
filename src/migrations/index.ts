import * as migration_20261015_172418_initial from './20261015_172418_initial';

export const migrations = [
  {
    up: migration_20261015_172418_initial.up,
    down: migration_20261015_172418_initial.down,
    name: '20261015_172418_initial'
  },
];
