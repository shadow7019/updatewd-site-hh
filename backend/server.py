from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from enum import Enum
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Enums
class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class DocumentType(str, Enum):
    INVOICE = "invoice"
    PACKING_LIST = "packing_list"
    SHIPPING_DOCS = "shipping_docs"
    CERTIFICATE = "certificate"
    OTHER = "other"

class MessageType(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ADMIN = "admin"


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    hashed_password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    phone: Optional[str] = None
    address: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    company: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    is_active: bool

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Order Models
class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    order_number: str
    product_category: str
    product_description: str
    quantity: str
    destination_country: str
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_delivery: Optional[datetime] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None
    total_amount: Optional[float] = None
    currency: str = "USD"

class OrderCreate(BaseModel):
    product_category: str
    product_description: str
    quantity: str
    destination_country: str
    notes: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None
    total_amount: Optional[float] = None

# Document Models
class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    user_id: str
    document_type: DocumentType
    filename: str
    file_data: str  # Base64 encoded file data
    file_size: int
    mime_type: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    description: Optional[str] = None

class DocumentCreate(BaseModel):
    order_id: str
    document_type: DocumentType
    filename: str
    file_data: str  # Base64 encoded file data
    file_size: int
    mime_type: str
    description: Optional[str] = None

class DocumentResponse(BaseModel):
    id: str
    order_id: str
    document_type: DocumentType
    filename: str
    file_size: int
    mime_type: str
    uploaded_at: datetime
    description: Optional[str] = None

# Message Models
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    order_id: Optional[str] = None
    message_type: MessageType = MessageType.USER
    subject: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False
    replied_to: Optional[str] = None

class MessageCreate(BaseModel):
    order_id: Optional[str] = None
    subject: str
    content: str

class MessageResponse(BaseModel):
    id: str
    order_id: Optional[str] = None
    message_type: MessageType
    subject: str
    content: str
    created_at: datetime
    is_read: bool
    replied_to: Optional[str] = None

# Contact Form Models
class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactFormCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str

# Quote Form Models
class QuoteForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    email: EmailStr
    phone: str
    product_category: str
    product_description: str
    destination_country: str
    quantity: str
    moq: Optional[str] = None
    urgency: Optional[str] = None
    special_instructions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuoteFormCreate(BaseModel):
    name: str
    company: str
    email: EmailStr
    phone: str
    product_category: str
    product_description: str
    destination_country: str
    quantity: str
    moq: Optional[str] = None
    urgency: Optional[str] = None
    special_instructions: Optional[str] = None

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return User(**user)

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
# API Routes

# Authentication Routes
@api_router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    
    new_user = User(**user_dict)
    await db.users.insert_one(new_user.dict())
    
    return UserResponse(**new_user.dict())

@api_router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User Profile Routes
@api_router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    return UserResponse(**current_user.dict())

@api_router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    update_data = user_update.dict(exclude_unset=True)
    if update_data:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_active_user)
):
    # Generate order number
    order_count = await db.orders.count_documents({"user_id": current_user.id})
    order_number = f"ORD-{current_user.id[:8]}-{order_count + 1:04d}"
    
    order_dict = order.dict()
    order_dict["user_id"] = current_user.id
    order_dict["order_number"] = order_number
    
    new_order = Order(**order_dict)
    await db.orders.insert_one(new_order.dict())
    
    return new_order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_active_user)):
    orders = await db.orders.find({"user_id": current_user.id}).sort("created_at", -1).to_list(100)
    return [Order(**order) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user)
):
    order = await db.orders.find_one({"id": order_id, "user_id": current_user.id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

# Document Routes
@api_router.post("/documents", response_model=DocumentResponse)
async def upload_document(
    document: DocumentCreate,
    current_user: User = Depends(get_current_active_user)
):
    # Verify order belongs to user
    order = await db.orders.find_one({"id": document.order_id, "user_id": current_user.id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    doc_dict = document.dict()
    doc_dict["user_id"] = current_user.id
    
    new_document = Document(**doc_dict)
    await db.documents.insert_one(new_document.dict())
    
    return DocumentResponse(**new_document.dict())

@api_router.get("/orders/{order_id}/documents", response_model=List[DocumentResponse])
async def get_order_documents(
    order_id: str,
    current_user: User = Depends(get_current_active_user)
):
    # Verify order belongs to user
    order = await db.orders.find_one({"id": order_id, "user_id": current_user.id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    documents = await db.documents.find({"order_id": order_id}).to_list(100)
    return [DocumentResponse(**doc) for doc in documents]

@api_router.get("/documents/{document_id}")
async def download_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    document = await db.documents.find_one({"id": document_id, "user_id": current_user.id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {
        "filename": document["filename"],
        "file_data": document["file_data"],
        "mime_type": document["mime_type"]
    }

# Message Routes
@api_router.post("/messages", response_model=MessageResponse)
async def create_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_active_user)
):
    msg_dict = message.dict()
    msg_dict["user_id"] = current_user.id
    
    new_message = Message(**msg_dict)
    await db.messages.insert_one(new_message.dict())
    
    return MessageResponse(**new_message.dict())

@api_router.get("/messages", response_model=List[MessageResponse])
async def get_messages(current_user: User = Depends(get_current_active_user)):
    messages = await db.messages.find({"user_id": current_user.id}).sort("created_at", -1).to_list(100)
    return [MessageResponse(**msg) for msg in messages]

@api_router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: str,
    current_user: User = Depends(get_current_active_user)
):
    await db.messages.update_one(
        {"id": message_id, "user_id": current_user.id},
        {"$set": {"is_read": True}}
    )
    return {"message": "Message marked as read"}

# Contact Form Route
@api_router.post("/contact", response_model=ContactForm)
async def create_contact(contact: ContactFormCreate):
    new_contact = ContactForm(**contact.dict())
    await db.contacts.insert_one(new_contact.dict())
    return new_contact

# Quote Form Route
@api_router.post("/quote", response_model=QuoteForm)
async def create_quote(quote: QuoteFormCreate):
    new_quote = QuoteForm(**quote.dict())
    await db.quotes.insert_one(new_quote.dict())
    return new_quote

# Dashboard Stats Route
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    total_orders = await db.orders.count_documents({"user_id": current_user.id})
    active_orders = await db.orders.count_documents({
        "user_id": current_user.id,
        "status": {"$in": ["pending", "processing", "shipped"]}
    })
    completed_orders = await db.orders.count_documents({
        "user_id": current_user.id,
        "status": "delivered"
    })
    unread_messages = await db.messages.count_documents({
        "user_id": current_user.id,
        "is_read": False
    })
    
    return {
        "total_orders": total_orders,
        "active_orders": active_orders,
        "completed_orders": completed_orders,
        "unread_messages": unread_messages
    }

# Original routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
