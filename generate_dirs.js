const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');
const authDir = path.join(srcDir, 'auth');
const docDir = path.join(srcDir, 'document');

function createDirs(baseDir, dirs) {
    dirs.forEach(d => {
        fs.mkdirSync(path.join(baseDir, d), { recursive: true });
    });
}

createDirs(authDir, [
    'application/use-cases',
    'presentation/http/controllers',
    'presentation/http/routes',
    'presentation/http/requests'
]);

createDirs(docDir, [
    'domain/entities',
    'domain/repositories',
    'application/use-cases',
    'infrastructure/persistence/repositories',
    'infrastructure/persistence/mappers',
    'presentation/http/controllers',
    'presentation/http/routes',
    'presentation/http/requests'
]);

console.log('Directories created!');
