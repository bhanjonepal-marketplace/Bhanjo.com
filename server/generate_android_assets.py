import os
from PIL import Image, ImageDraw

res_root = r'c:\Bhanjo.com\client\android\app\src\main\res'
symbol_path = r'c:\Bhanjo.com\client\public\pure_symbol.png'
icon_squircle_path = r'c:\Bhanjo.com\client\public\bhanjo-logo-icon.png'
logo_horizontal_path = r'c:\Bhanjo.com\client\public\bhanjo-logo.png'

symbol = Image.open(symbol_path).convert('RGBA')
icon_squircle = Image.open(icon_squircle_path).convert('RGBA')
logo_h = Image.open(logo_horizontal_path).convert('RGBA')

CRIMSON = (225, 29, 72, 255) # #E11D48

# 1. Update values/ic_launcher_background.xml
values_bg_path = os.path.join(res_root, 'values', 'ic_launcher_background.xml')
with open(values_bg_path, 'w', encoding='utf-8') as f:
    f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#E11D48</color>\n</resources>\n')
print('Updated values/ic_launcher_background.xml to #E11D48')

# Remove obsolete capacitor drawables if they exist
for obsolete in [
    os.path.join(res_root, 'drawable', 'ic_launcher_background.xml'),
    os.path.join(res_root, 'drawable-v24', 'ic_launcher_foreground.xml')
]:
    if os.path.exists(obsolete):
        try:
            os.remove(obsolete)
            print(f'Removed obsolete {obsolete}')
        except Exception as e:
            print(f'Warning removing {obsolete}: {e}')

# 2. Generate Mipmaps
mipmap_configs = {
    'mipmap-mdpi': {'fg': 108, 'legacy': 48},
    'mipmap-hdpi': {'fg': 162, 'legacy': 72},
    'mipmap-xhdpi': {'fg': 216, 'legacy': 96},
    'mipmap-xxhdpi': {'fg': 324, 'legacy': 144},
    'mipmap-xxxhdpi': {'fg': 432, 'legacy': 192}
}

for folder, cfg in mipmap_configs.items():
    folder_path = os.path.join(res_root, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # A. Adaptive Foreground (108dp canvas with safe-zone centered symbol)
    fg_size = cfg['fg']
    fg_img = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
    target_h = int(fg_size * 0.54)
    target_w = int(target_h * (symbol.width / symbol.height))
    res_sym = symbol.resize((target_w, target_h), Image.Resampling.LANCZOS)
    offset_x = (fg_size - target_w) // 2
    offset_y = (fg_size - target_h) // 2
    fg_img.paste(res_sym, (offset_x, offset_y), res_sym)
    fg_img.save(os.path.join(folder_path, 'ic_launcher_foreground.png'))
    
    # B. Legacy ic_launcher.png (512x512 high-res or exact density)
    # Android Capacitor standard uses 512x512 or exact density; we'll generate 512x512 for max sharpness
    legacy_size = 512
    legacy_img = Image.new('RGBA', (legacy_size, legacy_size), (0, 0, 0, 0))
    res_sq = icon_squircle.resize((legacy_size, legacy_size), Image.Resampling.LANCZOS)
    legacy_img.paste(res_sq, (0, 0), res_sq)
    legacy_img.save(os.path.join(folder_path, 'ic_launcher.png'))
    
    # C. Legacy ic_launcher_round.png (Circular crimson background with centered symbol)
    round_img = Image.new('RGBA', (legacy_size, legacy_size), (0, 0, 0, 0))
    # Draw anti-aliased circle
    circle_canvas = Image.new('RGBA', (legacy_size, legacy_size), CRIMSON)
    mask = Image.new('L', (legacy_size, legacy_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([4, 4, legacy_size - 5, legacy_size - 5], fill=255)
    
    # Put symbol inside
    r_sym_h = int(legacy_size * 0.60)
    r_sym_w = int(r_sym_h * (symbol.width / symbol.height))
    r_res_sym = symbol.resize((r_sym_w, r_sym_h), Image.Resampling.LANCZOS)
    r_offset_x = (legacy_size - r_sym_w) // 2
    r_offset_y = (legacy_size - r_sym_h) // 2
    circle_canvas.paste(r_res_sym, (r_offset_x, r_offset_y), r_res_sym)
    
    round_img.paste(circle_canvas, (0, 0), mask)
    round_img.save(os.path.join(folder_path, 'ic_launcher_round.png'))
    
    print(f'Generated launcher icons for {folder}')

# 3. Generate Splash Screens
splash_configs = {
    'drawable': (480, 320),
    'drawable-land-mdpi': (480, 320),
    'drawable-land-hdpi': (800, 480),
    'drawable-land-xhdpi': (1280, 720),
    'drawable-land-xxhdpi': (1600, 960),
    'drawable-land-xxxhdpi': (1920, 1280),
    'drawable-port-mdpi': (320, 480),
    'drawable-port-hdpi': (480, 800),
    'drawable-port-xhdpi': (720, 1280),
    'drawable-port-xxhdpi': (960, 1600),
    'drawable-port-xxxhdpi': (1280, 1920)
}

for folder, (w, h) in splash_configs.items():
    folder_path = os.path.join(res_root, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    splash = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    is_portrait = h >= w
    
    if is_portrait:
        target_w = int(w * 0.58)
    else:
        target_w = int(w * 0.38)
        
    target_h = int(target_w * (logo_h.height / logo_h.width))
    # Guard if target_h is too tall
    if target_h > int(h * 0.40):
        target_h = int(h * 0.40)
        target_w = int(target_h * (logo_h.width / logo_h.height))
        
    resized_logo = logo_h.resize((target_w, target_h), Image.Resampling.LANCZOS)
    offset_x = (w - target_w) // 2
    offset_y = (h - target_h) // 2
    splash.paste(resized_logo, (offset_x, offset_y), resized_logo)
    
    splash.save(os.path.join(folder_path, 'splash.png'))
    print(f'Generated splash.png for {folder} ({w}x{h})')

print('All Android branding assets successfully generated!')
