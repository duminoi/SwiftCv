const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), '.opencode/agents');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Match tools: Read, Grep, ... but ignore if it already starts with [
  content = content.replace(/^tools:\s*(?!\[)(.+)$/gm, (match, p1) => {
    const items = p1.split(',').map(s => `"${s.trim()}"`).filter(Boolean);
    changed = true;
    return `tools: [${items.join(', ')}]`;
  });

  content = content.replace(/^skills:\s*(?!\[)(.+)$/gm, (match, p1) => {
    const items = p1.split(',').map(s => `"${s.trim()}"`).filter(Boolean);
    changed = true;
    return `skills: [${items.join(', ')}]`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
