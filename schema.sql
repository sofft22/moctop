-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT NOT NULL, -- This will store Base64 strings or URLs
  inStock INTEGER DEFAULT 1,
  sizes TEXT NOT NULL -- Stored as a JSON string
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customerName TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  items TEXT NOT NULL, -- Stored as a JSON string
  subtotal INTEGER NOT NULL,
  deliveryFee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  paymentMethod TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  date TEXT NOT NULL
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  customerName TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  approved INTEGER DEFAULT 0,
  date TEXT NOT NULL
);

-- Settings Table (Only one row)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  deliveryFee INTEGER DEFAULT 2500,
  whatsappNumber TEXT,
  bankName TEXT,
  accountName TEXT,
  accountNumber TEXT
);

-- Content Table (Only one row)
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  heroImage TEXT,
  heroHeadline TEXT,
  aboutText TEXT,
  catBanana TEXT,
  catPuff TEXT,
  catMocktail TEXT
);

-- Insert default settings/content
INSERT OR IGNORE INTO settings (id) VALUES (1);
INSERT OR IGNORE INTO content (id) VALUES (1);