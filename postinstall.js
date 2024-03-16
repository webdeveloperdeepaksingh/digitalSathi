import { emptyDirSync, copySync } from 'fs-extra';
import { join } from 'path';

const topDir = __dirname;
emptyDirSync(join(topDir, 'public', 'tinymce'));
copySync(join(topDir, 'node_modules', 'tinymce'), join(topDir, 'public', 'tinymce'), { overwrite: true });