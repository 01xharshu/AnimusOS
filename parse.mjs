import fs from 'fs';
const data = fs.readFileSync('/Users/harshmishra/.gemini/antigravity-ide/brain/c0fed373-464c-4098-beb0-a8a495607cac/.system_generated/logs/transcript_full.jsonl', 'utf-8');
const lines = data.split('\n').filter(Boolean);
for (const line of lines) {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('@@ -1,0 +1,1034 @@')) {
        const content = obj.content;
        const start = content.indexOf('@@ -1,0 +1,1034 @@') + 19;
        const end = content.indexOf('[diff_block_end]', start);
        let diff = content.substring(start, end !== -1 ? end : content.length);
        
        let html = diff.split('\n').map(l => l.startsWith('+') ? l.slice(1) : l).join('\n');
        // If html ends with some prompt text, clean it up
        html = html.trim();
        if(html.endsWith('"[diff_block_end]')) html = html.slice(0, -16);
        
        fs.writeFileSync('index.html', html);
        console.log('Done parsing.');
        break;
    }
}
