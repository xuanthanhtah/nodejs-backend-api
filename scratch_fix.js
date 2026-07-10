const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('D:/backend/src/modules/user');

files.forEach(file => {
    if (file.endsWith('.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Replace firstName -> displayName
        if (content.includes('firstName')) {
            content = content.replace(/firstName/g, 'displayName');
            modified = true;
        }
        if (content.includes('FirstName')) {
            content = content.replace(/FirstName/g, 'DisplayName');
            modified = true;
        }

        // Replace lastName -> "" (We will handle this carefully)
        // Since lastName is often passed as a second arg, removing it is tricky with a blind replace.
        // I will just change lastName to role.
        if (content.includes('lastName')) {
            content = content.replace(/lastName/g, 'role');
            modified = true;
        }
        if (content.includes('LastName')) {
            content = content.replace(/LastName/g, 'Role');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
        }
    }
});
console.log('Done');
