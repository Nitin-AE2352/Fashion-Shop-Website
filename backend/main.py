import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import JSON
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from services.n8n_client import notify_order_placed_sync

# --------------------------------------------------
# 1. Configuration
# --------------------------------------------------

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "development-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fashion_shop.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

app = FastAPI(
    title="Fashion Shop API",
    description="Fashion Shop E-commerce Backend",
    version="1.0.0",
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# --------------------------------------------------
# 2. Database Models
# --------------------------------------------------


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")

    price = Column(Float, nullable=False)
    original_price = Column(Float, default=0)

    category = Column(String(100), default="Fashion")
    brand = Column(String(100), default="")
    image = Column(String(500), default="")

    stock = Column(Integer, default=0)
    rating = Column(Float, default=0)
    tag = Column(String(100), default="")

    # Product sizes JSON format mein store honge
    sizes = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)

    __table_args__ = (UniqueConstraint("user_id", "product_id"),)


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "product_id"),)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    shipping_address = Column(Text, nullable=False)
    phone = Column(String(20), nullable=False)
    payment_method = Column(String(30), default="COD")
    payment_status = Column(String(30), default="Pending")
    order_status = Column(String(30), default="Placed")
    created_at = Column(DateTime, default=datetime.utcnow)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)


Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# 3. Database Dependency
# --------------------------------------------------


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# 4. Password Security and JWT
# --------------------------------------------------


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 200000
    ).hex()

    return f"{salt}${password_hash}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, saved_hash = stored_hash.split("$")

        calculated_hash = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 200000
        ).hex()

        return secrets.compare_digest(calculated_hash, saved_hash)
    except ValueError:
        return False


def create_access_token(user_id: int):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {"sub": str(user_id), "exp": expires}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired login token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = int(payload.get("sub"))

    except (JWTError, ValueError, TypeError):
        raise credentials_error

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise credentials_error

    return user


# --------------------------------------------------
# 5. Request Schemas
# --------------------------------------------------


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProductRequest(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str = ""
    price: float = Field(gt=0)
    original_price: float = Field(default=0, ge=0)
    category: str = "Fashion"
    image: str = ""
    stock: int = Field(default=0, ge=0)
    sizes: list = Field(default_factory=list)


class CartRequest(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=100)


class OrderRequest(BaseModel):
    shipping_address: str = Field(min_length=5)
    phone: str = Field(min_length=7, max_length=20)


# --------------------------------------------------
# 6. Helper Functions
# --------------------------------------------------


def product_to_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "original_price": product.original_price,
        "category": product.category,
        "brand": product.brand,
        "image": product.image,
        "sizes": product.sizes or [],
        "stock": product.stock,
        "rating": product.rating,
        "tag": product.tag,
    }


def get_cart_details(db: Session, user_id: int):
    items = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.user_id == user_id)
        .all()
    )

    result = []
    total = 0

    for cart_item, product in items:
        subtotal = product.price * cart_item.quantity
        total += subtotal

        result.append(
            {
                "id": cart_item.id,
                "product_id": product.id,
                "name": product.name,
                "image": product.image,
                "price": product.price,
                "quantity": cart_item.quantity,
                "subtotal": round(subtotal, 2),
            }
        )

    return {"items": result, "total": round(total, 2)}


# --------------------------------------------------
# 7. General Routes
# --------------------------------------------------


@app.get("/")
def home():
    return {"message": "Fashion Shop Backend is running", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


# --------------------------------------------------
# 8. Authentication APIs
# --------------------------------------------------


@app.post("/api/auth/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = data.email.lower()

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        name=data.name.strip(), email=email, password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)

    return {
        "message": "Registration successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.post("/api/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.get("/api/auth/me")
def get_profile(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email}


# --------------------------------------------------
# 9. Product APIs
# --------------------------------------------------


@app.get("/api/products")
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    products = query.order_by(Product.id.desc()).all()

    return [product_to_dict(p) for p in products]


@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    return product_to_dict(product)


# Development helper: Add products through API.
# Protect this route with admin authentication before production.
@app.post("/api/products")
def add_product(data: ProductRequest, db: Session = Depends(get_db)):
    product = Product(**data.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product_to_dict(product)


@app.put("/api/products/{product_id}")
def update_product(
    product_id: int,
    data: ProductRequest,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product_to_dict(product)


# --------------------------------------------------
# 10. Cart APIs
# --------------------------------------------------


@app.get("/api/cart")
def get_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_cart_details(db, user.id)


@app.post("/api/cart")
def add_to_cart(
    data: CartRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == data.product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    if product.stock < data.quantity:
        raise HTTPException(400, "Insufficient stock")

    item = (
        db.query(CartItem)
        .filter(CartItem.user_id == user.id, CartItem.product_id == product.id)
        .first()
    )

    if item:
        new_quantity = item.quantity + data.quantity

        if new_quantity > product.stock:
            raise HTTPException(400, "Insufficient stock")

        item.quantity = new_quantity
    else:
        item = CartItem(user_id=user.id, product_id=product.id, quantity=data.quantity)
        db.add(item)

    db.commit()

    return get_cart_details(db, user.id)


@app.put("/api/cart/{item_id}")
def update_cart_item(
    item_id: int,
    data: CartRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == user.id)
        .first()
    )

    if not item:
        raise HTTPException(404, "Cart item not found")

    product = db.query(Product).filter(Product.id == item.product_id).first()

    if not product or data.quantity > product.stock:
        raise HTTPException(400, "Insufficient stock")

    item.quantity = data.quantity
    db.commit()

    return get_cart_details(db, user.id)


@app.delete("/api/cart/{item_id}")
def remove_cart_item(
    item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == user.id)
        .first()
    )

    if not item:
        raise HTTPException(404, "Cart item not found")

    db.delete(item)
    db.commit()

    return get_cart_details(db, user.id)


# --------------------------------------------------
# 11. Wishlist APIs
# --------------------------------------------------


@app.get("/api/wishlist")
def get_wishlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = (
        db.query(Product)
        .join(WishlistItem, WishlistItem.product_id == Product.id)
        .filter(WishlistItem.user_id == user.id)
        .all()
    )

    return [product_to_dict(p) for p in items]


@app.post("/api/wishlist/{product_id}")
def add_to_wishlist(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user.id, WishlistItem.product_id == product_id)
        .first()
    )

    if not existing:
        db.add(WishlistItem(user_id=user.id, product_id=product_id))
        db.commit()

    return {"message": "Product added to wishlist"}


@app.delete("/api/wishlist/{product_id}")
def remove_from_wishlist(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user.id, WishlistItem.product_id == product_id)
        .first()
    )

    if not item:
        raise HTTPException(404, "Wishlist item not found")

    db.delete(item)
    db.commit()

    return {"message": "Product removed from wishlist"}


# --------------------------------------------------
# 12. COD Order APIs
# --------------------------------------------------


@app.post("/api/orders")
def place_order(
    data: OrderRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_items = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.user_id == user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(400, "Your cart is empty")

    total = 0

    for cart_item, product in cart_items:
        if product.stock < cart_item.quantity:
            raise HTTPException(400, f"Insufficient stock for {product.name}")

        total += product.price * cart_item.quantity

    # COD only. Amount is calculated using database prices.
    shipping_charge = 0 if total >= 999 else 49
    final_total = round(total + shipping_charge, 2)

    order = Order(
        user_id=user.id,
        total_amount=final_total,
        shipping_address=data.shipping_address,
        phone=data.phone,
        payment_method="COD",
        payment_status="Pending",
        order_status="Placed",
    )

    db.add(order)
    db.flush()

    for cart_item, product in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=cart_item.quantity,
        )

        db.add(order_item)
        product.stock -= cart_item.quantity
        db.delete(cart_item)

    db.commit()
    db.refresh(order)

    # Notify n8n about the new order (fire-and-forget, never blocks checkout)
    order_payload = {
        "id": order.id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "shipping_address": order.shipping_address,
        "phone": order.phone,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {
                "product_id": product.id,
                "product_name": product.name,
                "price": product.price,
                "quantity": cart_item.quantity,
            }
            for cart_item, product in cart_items
        ],
    }
    notify_order_placed_sync(order_payload)

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_amount": order.total_amount,
        "payment_method": "COD",
        "payment_status": "Pending",
        "order_status": "Placed",
    }


@app.get("/api/orders")
def get_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        {
            "id": order.id,
            "total_amount": order.total_amount,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "created_at": order.created_at,
        }
        for order in orders
    ]


@app.get("/api/orders/{order_id}")
def get_order_details(
    order_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    order = (
        db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    )

    if not order:
        raise HTTPException(404, "Order not found")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

    return {
        "id": order.id,
        "total_amount": order.total_amount,
        "shipping_address": order.shipping_address,
        "phone": order.phone,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "created_at": order.created_at,
        "items": [
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "price": item.price,
                "quantity": item.quantity,
            }
            for item in items
        ],
    }
