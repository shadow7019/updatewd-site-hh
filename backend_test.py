#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for OneEXIM Client Portal
Tests all authentication, order management, document, messaging, and dashboard APIs
"""

import requests
import json
import base64
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://4cb324ea-2d3e-45c6-85fc-e3cc0bcc801e.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class OneEXIMAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, auth_required: bool = True) -> requests.Response:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = self.headers.copy()
        
        if auth_required and self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise

    def test_user_registration(self):
        """Test user registration endpoint"""
        test_user = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@globalexports.com",
            "company": "Global Exports Ltd",
            "phone": "+1-555-0123",
            "address": "123 Export Street, Trade City, TC 12345",
            "password": "SecurePass123!"
        }
        
        try:
            response = self.make_request("POST", "/register", test_user, auth_required=False)
            
            if response.status_code == 200:
                user_data = response.json()
                self.user_data = user_data
                self.log_test("User Registration", True, f"User registered successfully with ID: {user_data.get('id')}", user_data)
                return True
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
            return False

    def test_user_login(self):
        """Test user login endpoint"""
        login_data = {
            "email": "sarah.johnson@globalexports.com",
            "password": "SecurePass123!"
        }
        
        try:
            response = self.make_request("POST", "/login", login_data, auth_required=False)
            
            if response.status_code == 200:
                token_data = response.json()
                self.auth_token = token_data.get("access_token")
                self.log_test("User Login", True, f"Login successful, token type: {token_data.get('token_type')}", token_data)
                return True
            else:
                self.log_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")
            return False

    def test_get_profile(self):
        """Test get user profile endpoint"""
        try:
            response = self.make_request("GET", "/profile")
            
            if response.status_code == 200:
                profile_data = response.json()
                self.log_test("Get Profile", True, f"Profile retrieved for: {profile_data.get('name')}", profile_data)
                return True
            else:
                self.log_test("Get Profile", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Profile", False, f"Exception: {str(e)}")
            return False

    def test_update_profile(self):
        """Test update user profile endpoint"""
        update_data = {
            "name": "Sarah Johnson-Smith",
            "phone": "+1-555-0124",
            "address": "456 New Export Avenue, Trade City, TC 12346"
        }
        
        try:
            response = self.make_request("PUT", "/profile", update_data)
            
            if response.status_code == 200:
                updated_profile = response.json()
                self.log_test("Update Profile", True, f"Profile updated successfully", updated_profile)
                return True
            else:
                self.log_test("Update Profile", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Update Profile", False, f"Exception: {str(e)}")
            return False

    def test_create_order(self):
        """Test create order endpoint"""
        order_data = {
            "product_category": "Electronics",
            "product_description": "High-quality LED displays and components for international markets",
            "quantity": "500 units",
            "destination_country": "Germany",
            "notes": "Urgent shipment required for trade show in Frankfurt"
        }
        
        try:
            response = self.make_request("POST", "/orders", order_data)
            
            if response.status_code == 200:
                order = response.json()
                self.test_order_id = order.get("id")
                self.log_test("Create Order", True, f"Order created with number: {order.get('order_number')}", order)
                return True
            else:
                self.log_test("Create Order", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Order", False, f"Exception: {str(e)}")
            return False

    def test_get_orders(self):
        """Test get user orders endpoint"""
        try:
            response = self.make_request("GET", "/orders")
            
            if response.status_code == 200:
                orders = response.json()
                self.log_test("Get Orders", True, f"Retrieved {len(orders)} orders", orders)
                return True
            else:
                self.log_test("Get Orders", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Orders", False, f"Exception: {str(e)}")
            return False

    def test_get_specific_order(self):
        """Test get specific order endpoint"""
        if not hasattr(self, 'test_order_id'):
            self.log_test("Get Specific Order", False, "No order ID available from previous test")
            return False
            
        try:
            response = self.make_request("GET", f"/orders/{self.test_order_id}")
            
            if response.status_code == 200:
                order = response.json()
                self.log_test("Get Specific Order", True, f"Retrieved order: {order.get('order_number')}", order)
                return True
            else:
                self.log_test("Get Specific Order", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Specific Order", False, f"Exception: {str(e)}")
            return False

    def test_upload_document(self):
        """Test document upload endpoint"""
        if not hasattr(self, 'test_order_id'):
            self.log_test("Upload Document", False, "No order ID available from previous test")
            return False
            
        # Create a sample document (base64 encoded)
        sample_content = "This is a sample invoice document for testing purposes."
        encoded_content = base64.b64encode(sample_content.encode()).decode()
        
        document_data = {
            "order_id": self.test_order_id,
            "document_type": "invoice",
            "filename": "sample_invoice.txt",
            "file_data": encoded_content,
            "file_size": len(sample_content),
            "mime_type": "text/plain",
            "description": "Sample invoice document for order testing"
        }
        
        try:
            response = self.make_request("POST", "/documents", document_data)
            
            if response.status_code == 200:
                document = response.json()
                self.test_document_id = document.get("id")
                self.log_test("Upload Document", True, f"Document uploaded: {document.get('filename')}", document)
                return True
            else:
                self.log_test("Upload Document", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Upload Document", False, f"Exception: {str(e)}")
            return False

    def test_get_order_documents(self):
        """Test get order documents endpoint"""
        if not hasattr(self, 'test_order_id'):
            self.log_test("Get Order Documents", False, "No order ID available from previous test")
            return False
            
        try:
            response = self.make_request("GET", f"/orders/{self.test_order_id}/documents")
            
            if response.status_code == 200:
                documents = response.json()
                self.log_test("Get Order Documents", True, f"Retrieved {len(documents)} documents", documents)
                return True
            else:
                self.log_test("Get Order Documents", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Order Documents", False, f"Exception: {str(e)}")
            return False

    def test_download_document(self):
        """Test document download endpoint"""
        if not hasattr(self, 'test_document_id'):
            self.log_test("Download Document", False, "No document ID available from previous test")
            return False
            
        try:
            response = self.make_request("GET", f"/documents/{self.test_document_id}")
            
            if response.status_code == 200:
                document_data = response.json()
                self.log_test("Download Document", True, f"Downloaded: {document_data.get('filename')}", document_data)
                return True
            else:
                self.log_test("Download Document", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Download Document", False, f"Exception: {str(e)}")
            return False

    def test_send_message(self):
        """Test send message endpoint"""
        message_data = {
            "order_id": getattr(self, 'test_order_id', None),
            "subject": "Inquiry about shipment status",
            "content": "Hello, I would like to get an update on the status of my recent order. When can I expect the shipment to be processed? Thank you."
        }
        
        try:
            response = self.make_request("POST", "/messages", message_data)
            
            if response.status_code == 200:
                message = response.json()
                self.test_message_id = message.get("id")
                self.log_test("Send Message", True, f"Message sent: {message.get('subject')}", message)
                return True
            else:
                self.log_test("Send Message", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Send Message", False, f"Exception: {str(e)}")
            return False

    def test_get_messages(self):
        """Test get messages endpoint"""
        try:
            response = self.make_request("GET", "/messages")
            
            if response.status_code == 200:
                messages = response.json()
                self.log_test("Get Messages", True, f"Retrieved {len(messages)} messages", messages)
                return True
            else:
                self.log_test("Get Messages", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Messages", False, f"Exception: {str(e)}")
            return False

    def test_mark_message_read(self):
        """Test mark message as read endpoint"""
        if not hasattr(self, 'test_message_id'):
            self.log_test("Mark Message Read", False, "No message ID available from previous test")
            return False
            
        try:
            response = self.make_request("PUT", f"/messages/{self.test_message_id}/read", {})
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Mark Message Read", True, f"Message marked as read", result)
                return True
            else:
                self.log_test("Mark Message Read", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Mark Message Read", False, f"Exception: {str(e)}")
            return False

    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        try:
            response = self.make_request("GET", "/dashboard/stats")
            
            if response.status_code == 200:
                stats = response.json()
                self.log_test("Dashboard Stats", True, f"Stats retrieved: {stats}", stats)
                return True
            else:
                self.log_test("Dashboard Stats", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Dashboard Stats", False, f"Exception: {str(e)}")
            return False

    def test_contact_form(self):
        """Test contact form submission endpoint"""
        contact_data = {
            "name": "Michael Chen",
            "email": "michael.chen@tradecorp.com",
            "phone": "+1-555-0199",
            "company": "TradeCorp International",
            "message": "I'm interested in your export services for automotive parts to Asian markets. Could you please provide more information about your capabilities and pricing?"
        }
        
        try:
            response = self.make_request("POST", "/contact", contact_data, auth_required=False)
            
            if response.status_code == 200:
                contact = response.json()
                self.log_test("Contact Form", True, f"Contact form submitted by: {contact.get('name')}", contact)
                return True
            else:
                self.log_test("Contact Form", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Form", False, f"Exception: {str(e)}")
            return False

    def test_quote_request(self):
        """Test quote request submission endpoint"""
        quote_data = {
            "name": "Lisa Rodriguez",
            "company": "Pacific Imports LLC",
            "email": "lisa.rodriguez@pacificimports.com",
            "phone": "+1-555-0177",
            "product_category": "Textiles",
            "product_description": "High-quality cotton fabrics and garments for retail distribution",
            "destination_country": "Mexico",
            "quantity": "10,000 pieces",
            "moq": "5,000 pieces",
            "urgency": "Within 30 days",
            "special_instructions": "Need samples before bulk order. Prefer eco-friendly packaging."
        }
        
        try:
            response = self.make_request("POST", "/quote", quote_data, auth_required=False)
            
            if response.status_code == 200:
                quote = response.json()
                self.log_test("Quote Request", True, f"Quote request submitted by: {quote.get('name')}", quote)
                return True
            else:
                self.log_test("Quote Request", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Quote Request", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("=" * 80)
        print("ONEEXIM CLIENT PORTAL - BACKEND API TESTING")
        print("=" * 80)
        print(f"Testing against: {self.base_url}")
        print(f"Started at: {datetime.now().isoformat()}")
        print("=" * 80)
        
        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        print("-" * 40)
        self.test_user_registration()
        self.test_user_login()
        self.test_get_profile()
        self.test_update_profile()
        
        # Order Management Tests
        print("\n📦 ORDER MANAGEMENT TESTS")
        print("-" * 40)
        self.test_create_order()
        self.test_get_orders()
        self.test_get_specific_order()
        
        # Document Management Tests
        print("\n📄 DOCUMENT MANAGEMENT TESTS")
        print("-" * 40)
        self.test_upload_document()
        self.test_get_order_documents()
        self.test_download_document()
        
        # Communication Tests
        print("\n💬 COMMUNICATION TESTS")
        print("-" * 40)
        self.test_send_message()
        self.test_get_messages()
        self.test_mark_message_read()
        
        # Dashboard Tests
        print("\n📊 DASHBOARD TESTS")
        print("-" * 40)
        self.test_dashboard_stats()
        
        # Public Form Tests
        print("\n📝 PUBLIC FORM TESTS")
        print("-" * 40)
        self.test_contact_form()
        self.test_quote_request()
        
        # Summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if result["success"]:
                print(f"  - {result['test']}")
                
        print("\n" + "=" * 80)

if __name__ == "__main__":
    tester = OneEXIMAPITester()
    tester.run_all_tests()