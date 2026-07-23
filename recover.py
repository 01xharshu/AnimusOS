import json
import re

transcript_path = '/Users/harshmishra/.gemini/antigravity-ide/brain/c0fed373-464c-4098-beb0-a8a495607cac/.system_generated/logs/transcript_full.jsonl'
with open(transcript_path, 'r') as f:
    lines = f.readlines()

for line in lines:
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT' and '@@ -1,0 +1,1034 @@' in data.get('content', ''):
        content = data['content']
        # Extract everything between @@ -1,0 +1,1034 @@ and [diff_block_end]
        match = re.search(r'@@ -1,0 \+1,1034 @@\n(.*?)(?:\[diff_block_end\]|\Z)', content, re.DOTALL)
        if match:
            diff_text = match.group(1)
            # Remove the leading '+' from each line
            recovered = '\n'.join([l[1:] if l.startswith('+') else l for l in diff_text.split('\n')])
            with open('/Users/harshmishra/Documents/GitHub/AnimusOS/index.html', 'w') as out:
                out.write(recovered)
            print("Recovered index.html successfully.")
            break
