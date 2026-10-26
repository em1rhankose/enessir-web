import * as migration_20261015_172418_initial from './20261015_172418_initial';
import * as migration_20261025_150026_media_blob_object_key from './20261025_150026_media_blob_object_key';
import * as migration_20261026_150825_ofisimiz_label from './20261026_150825_ofisimiz_label';
import * as migration_20261026_153743_qualification_show_year from './20261026_153743_qualification_show_year';

export const migrations = [
  {
    up: migration_20261015_172418_initial.up,
    down: migration_20261015_172418_initial.down,
    name: '20261015_172418_initial',
  },
  {
    up: migration_20261025_150026_media_blob_object_key.up,
    down: migration_20261025_150026_media_blob_object_key.down,
    name: '20261025_150026_media_blob_object_key',
  },
  {
    up: migration_20261026_150825_ofisimiz_label.up,
    down: migration_20261026_150825_ofisimiz_label.down,
    name: '20261026_150825_ofisimiz_label',
  },
  {
    up: migration_20261026_153743_qualification_show_year.up,
    down: migration_20261026_153743_qualification_show_year.down,
    name: '20261026_153743_qualification_show_year'
  },
];
