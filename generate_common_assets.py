from pathlib import Path
import re
root = Path('.')
text = (root / 'semana11.html').read_text(encoding='utf-8')
style_match = re.search(r'<style>(.*?)</style>', text, re.S)
script_match = re.search(r'<script>(.*?)</script>\s*</body>', text, re.S)
if not style_match:
    raise RuntimeError('Style block not found in semana11.html')
if not script_match:
    raise RuntimeError('Script block not found in semana11.html')
(root / 'common.css').write_text(style_match.group(1).strip(), encoding='utf-8')
(root / 'common.js').write_text(script_match.group(1).strip(), encoding='utf-8')
print('Created common.css and common.js')
