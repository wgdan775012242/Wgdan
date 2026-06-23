# لعبة صنعاء — Prototype (Godot 4)

هذا المشروع نسخة أولية للعبة 2D من أعلى (top-down)؛ تحتوي على سكربتات جاهزة، أصول رسومية (SVG) بسيطة، وتعليمات بالعربي لتشغيل المشروع في Godot 4.

محتويات المستودع:
- project.godot — إعداد مشروع Godot بسيط
- scripts/ — سكربتات GDScript (Player, Taxi, Plane, Game)
- assets/ — أصول رسومية (SVG) وخلفية مبسطة
- README.md — هذا الملف (تعليمات)
- .gitignore
- LICENSE (MIT)

تنبيهات مهمة:
- ركّزت هنا على رفع السكربتات والأصول الرسومية كـ SVG عالية الجودة وخفيفة؛ سيوفّر ذلك مظهر "فلات/كارتون" نظيف ويمكن تعديل الألوان بسهولة.
- أدرجت تعليمات إنشاء المشاهد وربط السكربتات داخل Godot لأن ملفات .tscn قد تحتاج ضبط موارد محلية بحسب إعدادات Godot للمستخدم.

كيف تفتح المشروع وتبدأ (Godot 4):
1. حمّل وتثبّت Godot 4 من https://godotengine.org/download
2. افتح Godot، اختر "Import" ثم اختر مجلد هذا المشروع (المجلد الذي يحتوي project.godot). سيتم فتح المشروع.
3. داخل Godot، أنشئ مشاهد جديدة كما يلي (الخطوات مفصلة أدناه تحت "إعداد المشاهد") أو اتبع المشهد الرئيسي لو أردت تكوينه يدويا.

إعداد المشاهد الأساسية (سهل وسريع):
- Main.tscn (Node2D root)
  - TileMap أو Sprite (استخدم assets/bg_sanaa.svg كبخلفية)
  - Player (مشهد فرعي) — أسفلها CharacterBody2D مع Sprite2D(s) وCollisionShape2D
  - TaxiSpawn (Node2D) — نقاط سباون للتاكسي (انشئ عدة Node2D)
  - Game (Node2D) — أضف عليه سكربت scripts/Game.gd وضع خصائص taxi_scene وplane_scene

- Player.tscn
  - CharacterBody2D (root)
    - Sprite2D (اسم: Male)
    - Sprite2D (اسم: Female)
    - CollisionShape2D
  - أضف scripts/Player.gd على الجذر، عيّن الخصائص sprite_male وsprite_female إلى Sprite2D المناسبة.

- Taxi.tscn
  - CharacterBody2D
    - Sprite2D (تاكسي)
    - CollisionShape2D
  - أضف scripts/Taxi.gd على الجذر

- Plane.tscn
  - Node2D
    - Sprite2D (طائرة)
  - أضف scripts/Plane.gd على الجذر

مفاتيح التحكم الافتراضية (Project → Project Settings → Input Map):
- ui_up (W, Up)
- ui_down (S, Down)
- ui_left (A, Left)
- ui_right (D, Right)
- switch_player (Tab)

تشغيل اللعبة:
- افتح Main.tscn واضغط Play Scene (F6) لتشغيل مشهد الاختبار.

تصدير للويندوز/HTML5:
- قبل تصدير HTML5 ستحتاج لتثبيت Emscripten/export templates من Godot.
- من Editor → Install Export Templates ثم إعداد Export Presets.

ملفات سكربتات مرفقة في المجلد scripts/ — افتحها وعدّل إن رغبت.

إذا أردت، أستطيع الآن:
1) إكمال إنشاء مشهد .tscn أوتوماتيكياً ورفع نسخة جاهزة قابلة للتشغيل (أحاول ذلك إذا توافق).  
2) أو أن أجهز ZIP جاهز للتنزيل يحتوي كل شيء مع تهيئة المشاهد كاملة — وصول سريع وسهل.  

أخبرني إذا تريد أن أتابع وأضيف المشاهد .tscn الجاهزة أو أجهز ZIP للتنزيل الآن.
