const fs = require('fs');

const files = [
  'd:/Projects/HQSP/apps/web/src/app/owner/orders/page.tsx',
  'd:/Projects/HQSP/apps/web/src/app/owner/menu/page.tsx',
  'd:/Projects/HQSP/apps/web/src/app/owner/tables/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace font-bold with font-medium, EXCEPT if the line has font-heading or text-2xl or text-3xl
  let lines = content.split('\n');
  lines = lines.map(line => {
    if (line.includes('font-heading') || line.includes('text-2xl') || line.includes('text-3xl') || line.includes('text-xl')) {
      return line; // keep headings bold
    }
    return line.replace(/font-bold/g, 'font-medium');
  });
  
  fs.writeFileSync(file, lines.join('\n'));
});
console.log('Replaced successfully.');
