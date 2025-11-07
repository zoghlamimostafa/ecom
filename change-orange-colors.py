#!/usr/bin/env python3
"""
Script pour changer toutes les couleurs orange vers #FF914D
"""

import os
import re
from pathlib import Path

# Nouvelle couleur principale
NEW_ORANGE = "#FF914D"
NEW_ORANGE_DARKER = "#E68000"  # Pour les hovers et gradients
NEW_ORANGE_LIGHTER = "#FFA76D"  # Pour les fins de gradient

# Mappings de couleurs à remplacer
COLOR_MAPPINGS = {
    # Hex colors (case insensitive)
    r'#FF6F00': NEW_ORANGE,
    r'#FF6B00': NEW_ORANGE,
    r'#FF6B35': NEW_ORANGE,
    r'#ff6b35': NEW_ORANGE,
    r'#FF6B6B': NEW_ORANGE,
    r'#FF7A00': NEW_ORANGE,
    r'#FF8E53': NEW_ORANGE,
    r'#FF8C5A': NEW_ORANGE_LIGHTER,
    r'#FF9F40': NEW_ORANGE_LIGHTER,
    r'#FFA726': NEW_ORANGE_LIGHTER,
    r'#ff8c42': NEW_ORANGE_LIGHTER,
    r'#FF8C42': NEW_ORANGE_LIGHTER,
    r'#F7931E': NEW_ORANGE_LIGHTER,
    r'#e66400': NEW_ORANGE_DARKER,
    r'#ff5722': NEW_ORANGE_DARKER,
    
    # RGBA colors - FF6F00 = rgba(255, 111, 0)
    r'rgba\(255,\s*111,\s*0': f'rgba(255, 145, 77',  # #FF914D = rgb(255, 145, 77)
    r'rgba\(255,111,0': f'rgba(255,145,77',
    
    # RGBA colors - FF6B35 = rgba(255, 107, 53)
    r'rgba\(255,\s*107,\s*53': f'rgba(255, 145, 77',
    r'rgba\(255,107,53': f'rgba(255,145,77',
    
    # RGBA colors - FF6B6B = rgba(255, 107, 107)
    r'rgba\(255,\s*107,\s*107': f'rgba(255, 145, 77',
    r'rgba\(255,107,107': f'rgba(255,145,77',
    
    # RGBA colors - FF6B00 = rgba(255, 107, 0)
    r'rgba\(255,\s*107,\s*0': f'rgba(255, 145, 77',
    r'rgba\(255,107,0': f'rgba(255,145,77',
}

def replace_colors_in_file(file_path):
    """Replace all orange colors in a CSS file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        # Apply all color replacements
        for old_color, new_color in COLOR_MAPPINGS.items():
            pattern = re.compile(old_color, re.IGNORECASE)
            matches = pattern.findall(content)
            if matches:
                content = pattern.sub(new_color, content)
                replacements_made += len(matches)
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {file_path.name}: {replacements_made} remplacements")
            return replacements_made
        else:
            return 0
            
    except Exception as e:
        print(f"❌ Erreur avec {file_path}: {e}")
        return 0

def main():
    """Main function"""
    # Find all CSS files
    client_dir = Path("/home/blackrdp/sanny/san/ecomerce_sanny/Client/src")
    css_files = list(client_dir.rglob("*.css"))
    
    print(f"🔍 {len(css_files)} fichiers CSS trouvés\n")
    
    total_replacements = 0
    modified_files = 0
    
    for css_file in sorted(css_files):
        replacements = replace_colors_in_file(css_file)
        if replacements > 0:
            modified_files += 1
            total_replacements += replacements
    
    print(f"\n📊 Résumé:")
    print(f"   - Fichiers modifiés: {modified_files}")
    print(f"   - Total remplacements: {total_replacements}")
    print(f"   - Nouvelle couleur: {NEW_ORANGE}")

if __name__ == "__main__":
    main()
