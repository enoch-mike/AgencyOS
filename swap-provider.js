const fs = require('fs');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');
fs.writeFileSync('prisma/schema.prisma', schema.replace('provider = "sqlite"', 'provider = "postgresql"'));
console.log('Provider swapped to postgresql');
