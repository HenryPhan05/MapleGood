-- ============================================================================
-- Maple Goods E-Commerce Database Schema (Optimized - No FK, ORM Managed)
-- ============================================================================

-- Drop existing tables
DROP TABLE IF EXISTS CustomerReviews;
DROP TABLE IF EXISTS WishlistItems;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS CartItems;
DROP TABLE IF EXISTS ShoppingCart;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS ProductCategory;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Customer;

-- ============================================================================
-- Customer
-- ============================================================================
CREATE TABLE Customer (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,

    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(50),
    postalCode VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Canada',

    role VARCHAR(20) DEFAULT 'CUSTOMER',
    isDeleted BOOLEAN DEFAULT FALSE,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- Category
-- ============================================================================
CREATE TABLE Category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parentCategoryID INT,

    isDeleted BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Product
-- ============================================================================
CREATE TABLE Product (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(200) NOT NULL,
    description TEXT,

    price DECIMAL(10,2) NOT NULL,
    stockQuantity INT NOT NULL DEFAULT 0,
    version INT DEFAULT 0,

    imageURL VARCHAR(255),
    brand VARCHAR(100),
    model VARCHAR(100),
    specifications TEXT,

    isActive BOOLEAN DEFAULT TRUE,
    isDeleted BOOLEAN DEFAULT FALSE,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CHECK (price >= 0),
    CHECK (stockQuantity >= 0)
);

-- ============================================================================
-- ProductCategory
-- ============================================================================
CREATE TABLE ProductCategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productID INT NOT NULL,
    categoryID INT NOT NULL,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_product_category (productID, categoryID)
);

-- ============================================================================
-- Order
-- ============================================================================
CREATE TABLE `Order` (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,

    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orderStatus VARCHAR(20) DEFAULT 'PENDING',

    totalAmount DECIMAL(10,2) NOT NULL,

    shippingAddress VARCHAR(255),
    shippingCity VARCHAR(100),
    shippingProvince VARCHAR(50),
    shippingPostalCode VARCHAR(10),
    shippingCountry VARCHAR(50) DEFAULT 'Canada',

    isDeleted BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 0,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CHECK (totalAmount >= 0)
);

-- ============================================================================
-- OrderItems
-- ============================================================================
CREATE TABLE OrderItems (
    orderItemID INT AUTO_INCREMENT PRIMARY KEY,

    orderID INT NOT NULL,
    productID INT NOT NULL,

    quantity INT NOT NULL,

    unitPrice DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    productNameSnapshot VARCHAR(200),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (quantity > 0),
    CHECK (unitPrice >= 0),
    CHECK (subtotal >= 0)
);

-- ============================================================================
-- Payment
-- ============================================================================
CREATE TABLE Payment (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,

    orderID INT NOT NULL,
    customerID INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,
    paymentMethod VARCHAR(50),
    paymentStatus VARCHAR(20) DEFAULT 'PENDING',

    transactionId VARCHAR(100),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (amount >= 0)
);

-- ============================================================================
-- ShoppingCart
-- ============================================================================
CREATE TABLE ShoppingCart (
    cartID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,

    expiresAt TIMESTAMP NULL,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_customer_cart (customerID)
);

-- ============================================================================
-- CartItems
-- ============================================================================
CREATE TABLE CartItems (
    cartItemID INT AUTO_INCREMENT PRIMARY KEY,

    cartID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (quantity > 0),

    UNIQUE KEY unique_cart_product (cartID, productID)
);

-- ============================================================================
-- Wishlist
-- ============================================================================
CREATE TABLE Wishlist (
    wishlistID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,

    wishlistName VARCHAR(100) DEFAULT 'My Wishlist',

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- WishlistItems
-- ============================================================================
CREATE TABLE WishlistItems (
    wishlistItemID INT AUTO_INCREMENT PRIMARY KEY,

    wishlistID INT NOT NULL,
    productID INT NOT NULL,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_wishlist_product (wishlistID, productID)
);

-- ============================================================================
-- CustomerReviews
-- ============================================================================
CREATE TABLE CustomerReviews (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,

    customerID INT NOT NULL,
    productID INT NOT NULL,

    rating INT NOT NULL,
    reviewText TEXT,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (rating >= 1 AND rating <= 5),

    UNIQUE KEY unique_review (customerID, productID)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX idx_product_name ON Product(productName);
CREATE INDEX idx_product_active ON Product(isActive);

CREATE INDEX idx_order_customer ON `Order`(customerID);
CREATE INDEX idx_order_date ON `Order`(orderDate);

CREATE INDEX idx_orderitems_order ON OrderItems(orderID);
CREATE INDEX idx_orderitems_product ON OrderItems(productID);

CREATE INDEX idx_cart_customer ON ShoppingCart(customerID);

CREATE INDEX idx_review_product ON CustomerReviews(productID);
