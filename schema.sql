PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE Product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dropea_id TEXT UNIQUE,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    category TEXT,
    product_type TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    upsell_kits TEXT NOT NULL DEFAULT '[]',
    landing_page_data TEXT,
    recommended_products TEXT NOT NULL DEFAULT '[]',
    manual_price REAL,
    placement TEXT NOT NULL DEFAULT 'HIDDEN',
    is_active INTEGER NOT NULL DEFAULT 0,
    secondary_images TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE GeneratedPage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    pain TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    h1_customizado TEXT,
    conteudo_spin TEXT,
    status_indexacao TEXT NOT NULL DEFAULT 'Pending',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE StoreSettings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    profit_margin_percent REAL NOT NULL DEFAULT 30.0,
    fixed_shipping_cost REAL NOT NULL DEFAULT 7.0,
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE LandingCategory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    is_default INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    label_es TEXT NOT NULL DEFAULT '',
    label_pt TEXT NOT NULL DEFAULT '',
    label_en TEXT NOT NULL DEFAULT '',
    keywords_es TEXT NOT NULL DEFAULT '[]',
    keywords_pt TEXT NOT NULL DEFAULT '[]',
    keywords_en TEXT NOT NULL DEFAULT '[]',
    copy_es TEXT NOT NULL DEFAULT '{}',
    copy_pt TEXT NOT NULL DEFAULT '{}',
    copy_en TEXT NOT NULL DEFAULT '{}',
    default_image_url TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE BundleRule (
    id INTEGER PRIMARY KEY DEFAULT 1,
    category_weight REAL NOT NULL DEFAULT 2.0,
    tag_weight REAL NOT NULL DEFAULT 1.0,
    price_weight REAL NOT NULL DEFAULT 1.0,
    price_range_pct REAL NOT NULL DEFAULT 30.0,
    min_score REAL NOT NULL DEFAULT 2.0,
    default_discount_pct REAL NOT NULL DEFAULT 10.0,
    max_kit_size INTEGER NOT NULL DEFAULT 3,
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE HomeConfig (
    id INTEGER PRIMARY KEY DEFAULT 1,
    sections TEXT NOT NULL DEFAULT '[]',
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE SiteCopy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value_es TEXT NOT NULL DEFAULT '{}',
    value_pt TEXT NOT NULL DEFAULT '{}',
    value_en TEXT NOT NULL DEFAULT '{}',
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE NavConfig (
    id INTEGER PRIMARY KEY DEFAULT 1,
    top_nav TEXT NOT NULL DEFAULT '[]',
    mega_menu TEXT NOT NULL DEFAULT '{}',
    footer TEXT NOT NULL DEFAULT '[]',
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ThemeConfig (
    id INTEGER PRIMARY KEY DEFAULT 1,
    brand_name TEXT NOT NULL DEFAULT 'Beauthé',
    logo_url TEXT,
    favicon_url TEXT,
    color_primary TEXT NOT NULL DEFAULT '#2C2826',
    color_accent TEXT NOT NULL DEFAULT '#C4A49A',
    color_bg TEXT NOT NULL DEFAULT '#FCFAF8',
    color_surface TEXT NOT NULL DEFAULT '#F4EFEA',
    color_border TEXT NOT NULL DEFAULT '#F1EBE6',
    color_text TEXT NOT NULL DEFAULT '#5C534F',
    font_heading TEXT NOT NULL DEFAULT 'Outfit',
    font_body TEXT NOT NULL DEFAULT 'Outfit',
    radius_sm INTEGER NOT NULL DEFAULT 12,
    radius_md INTEGER NOT NULL DEFAULT 20,
    radius_lg INTEGER NOT NULL DEFAULT 32,
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE Coupon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_pct REAL NOT NULL DEFAULT 0,
    min_subtotal REAL NOT NULL DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    starts_at TEXT,
    ends_at TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE PromoBanner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    placement TEXT NOT NULL DEFAULT 'TOP',
    enabled INTEGER NOT NULL DEFAULT 1,
    message_es TEXT NOT NULL DEFAULT '',
    message_pt TEXT NOT NULL DEFAULT '',
    message_en TEXT NOT NULL DEFAULT '',
    cta_label_es TEXT NOT NULL DEFAULT '',
    cta_label_pt TEXT NOT NULL DEFAULT '',
    cta_label_en TEXT NOT NULL DEFAULT '',
    cta_link TEXT NOT NULL DEFAULT '',
    bg_color TEXT NOT NULL DEFAULT '#C4A49A',
    text_color TEXT NOT NULL DEFAULT '#FFFFFF',
    segment TEXT NOT NULL DEFAULT 'ALL',
    starts_at TEXT,
    ends_at TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS "Order" (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code    TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    email         TEXT,
    address       TEXT,
    zip           TEXT,
    city          TEXT,
    country       TEXT,
    items         TEXT NOT NULL DEFAULT '[]',  -- JSON [{id,name,price,quantity,image}]
    subtotal      REAL NOT NULL DEFAULT 0,
    discount      REAL NOT NULL DEFAULT 0,
    coupon_code   TEXT,
    shipping      REAL NOT NULL DEFAULT 0,
    total         REAL NOT NULL DEFAULT 0,
    payment_method TEXT,
    status        TEXT NOT NULL DEFAULT 'pendente_confirmacao',
    createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt     TEXT NOT NULL DEFAULT (datetime('now'))
, email_enc TEXT);
CREATE TABLE AdminUser (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'owner',
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until    INTEGER,
    last_login_at   INTEGER,
    createdAt       INTEGER NOT NULL
);
CREATE TABLE Session (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    token_hash  TEXT NOT NULL UNIQUE,
    user_type   TEXT NOT NULL,
    user_id     INTEGER NOT NULL,
    ip          TEXT,
    user_agent  TEXT,
    createdAt   INTEGER NOT NULL,
    expires_at  INTEGER NOT NULL
);
CREATE TABLE User (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash   TEXT NOT NULL,
    name            TEXT,
    birthday        TEXT,
    email_verified  INTEGER NOT NULL DEFAULT 0,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until    INTEGER,
    last_login_at   INTEGER,
    createdAt       INTEGER NOT NULL
, email_enc TEXT);
CREATE TABLE EmailToken (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    token_hash  TEXT NOT NULL UNIQUE,
    purpose     TEXT NOT NULL,
    createdAt   INTEGER NOT NULL,
    expires_at  INTEGER NOT NULL,
    used_at     INTEGER
);
CREATE TABLE RateLimit (
    bucket       TEXT PRIMARY KEY,
    count        INTEGER NOT NULL DEFAULT 0,
    window_start INTEGER NOT NULL
);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_product_dropea ON Product(dropea_id);
CREATE INDEX idx_product_active ON Product(is_active);
CREATE INDEX idx_product_placement ON Product(placement);
CREATE INDEX idx_generated_slug ON GeneratedPage(slug);
CREATE INDEX idx_order_code ON "Order"(order_code);
CREATE INDEX idx_order_email ON "Order"(email);
CREATE INDEX idx_session_expires ON Session(expires_at);
CREATE INDEX idx_emailtoken_user ON EmailToken(user_id, purpose);
