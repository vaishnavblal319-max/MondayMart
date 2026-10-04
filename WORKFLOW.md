# 🛒 MondayMart — Complete End-to-End Workflow Guide

Welcome to **MondayMart**! This guide is written for anyone brand new to the platform. 

Because MondayMart operates on a live, real database (Firebase Cloud Firestore) with **zero hardcoded dummy data**, all data in the system (stores, items, orders) is created dynamically through the natural user flow.

Here is the exact step-by-step path to test and experience all features from scratch.

---

## 🧭 Platform Overview: 3 Core Roles

| Role | Email Type | Purpose |
|---|---|---|
| **Admin** | `admin@mondaymart.in` | Reviews seller KYC applications, verifies student IDs, issues official `@mondaymart.in` seller accounts. |
| **Seller** | `<storename>@mondaymart.in` | Manages store inventory, adds food/products with prices and stock, fulfills orders, and verifies customer pickup PINs. |
| **Customer** | Any personal email (e.g., `user@gmail.com`) | Browses products, adds items to cart, places orders, and receives a unique **QR Pass & 4-digit PIN** for pickup. |

---

## 📋 The Complete 6-Step Workflow

```
[Step 1: Seller Registers] ──► [Step 2: Admin Approves] ──► [Step 3: Seller Adds Items]
                                                                     │
[Step 6: Completed!] ◄─── [Step 5: PIN Verification] ◄─── [Step 4: Customer Orders]
```

---

### Step 1: Register as a New Seller (Onboarding & KYC)
*Simulate a campus student or food vendor applying to open a stall.*

1. Open the website: **`http://localhost:5173`**
2. On the top navigation bar or landing banner, click **"Sell on MondayMarket"** (or **"Register Store"**).
3. Fill out the application form:
   - **Store / Stall Name:** e.g., `Campus Treats` or `Burger House`
   - **Owner / Student Name:** e.g., `Rahul Sharma`
   - **Personal Email:** e.g., `rahul@gmail.com`
   - **Mobile Phone:** e.g., `9876543210`
   - **Category:** Select a category (e.g., *Fast Food*, *Bakery*, *Beverages*)
   - **Campus Location / Address:** e.g., *Food Court Stall #4*
   - **ID Photo / Document:** Paste any image URL or leave the sample preview.
4. Click **"Verify Phone Number & Submit"**.
5. **Mobile Phone OTP Verification:**
   - A 6-digit SMS verification modal will appear.
   - You will see the active demo code displayed (e.g., `482910`).
   - Click **"Auto-fill OTP"** (or type the code) and click **"Verify & Submit Application"**.
   - Your application is now submitted to the Admin KYC queue in Firestore!

---

### Step 2: Log in as Admin & Issue Seller Credentials
*Simulate the administrator approving the new store.*

1. In the top navigation bar, click **"Sign In"** (or the User icon).
2. Enter the admin credentials:
   - **Email:** `admin@mondaymart.in`
   - **Password:** *(any password or leave as is)*
   - Click **"Sign In"**.
3. You will be automatically routed to the **IEDC Venture Approval Console**.
4. Under the **Pending Verification** tab:
   - You will see your newly registered application (`Campus Treats` by `Rahul Sharma`).
   - You can review their details, phone number, category, and ID photo preview.
5. Click the green **"Approve & Provision Account"** button.
6. The system will automatically:
   - Issue an official institutional email: e.g. `campustreats@mondaymart.in`.
   - Generate a temporary password (e.g., `seller4821`).
   - Save the approved seller profile directly into Firestore!
7. **Next action:** Click **"Login as this Seller Now"** (or copy the generated email and password).

---

### Step 3: Seller Adds Products to the Marketplace
*Simulate the store owner setting up their live menu.*

1. You are now in the **Seller Portal** (`Campustreats`).
2. Switch to the **"Live Inventory"** tab.
3. Click the **"+ Add New Product"** button.
4. Fill in the product details:
   - **Product Name:** e.g., `Crispy Chicken Burger` or `Cold Coffee`
   - **Category:** e.g., `Fast Food` or `Beverages`
   - **Price (₹):** e.g., `120`
   - **Initial Stock Quantity:** e.g., `15`
   - **Dietary Preference:** Select *Veg* or *Non-Veg*
   - **Description:** e.g., *Freshly grilled patty with spiced mayo and lettuce.*
   - **Food Image:** Paste an image link or leave default.
5. Click **"Publish to Marketplace"**.
6. Repeat this step for 2–3 items so the marketplace has a rich selection.
7. *Notice:* Your items now appear under the Inventory table. You can edit their price or stock anytime, or delete them.

---

### Step 4: Customer Browses & Places an Order
*Simulate a student ordering food from their phone or laptop.*

1. In the top navbar, click your profile name and click **"Sign Out"** (or open an Incognito window).
2. Click **"Sign In"** → or use **"Create Customer Account"**:
   - **Name:** e.g., `Aditi Verma`
   - **Email:** e.g., `aditi@gmail.com`
   - **Password:** *(any password)*
   - Click **"Sign Up"** (or log in directly with any personal email).
3. Click **"Explore Menu"** or select **"Marketplace"** from the navigation bar.
4. **Browse & Filter:**
   - Search for products using the search bar.
   - Filter by categories (*Fast Food*, *Beverages*, etc.).
   - Toggle the **"Veg Only"** filter.
5. Click **"+ Add to Cart"** on the items you want.
   - Notice the stock counter: customers cannot add more units than the seller has in stock!
6. Click the **Floating Cart button** (bottom right or top navbar).
7. Review your cart:
   - View Subtotal, GST (5%), and Packaging Fee.
   - Enter your Delivery / Counter Pickup Notes (e.g. *Pick up at 1:30 PM*).
8. Click **"Proceed to Checkout"**.
9. **Order Confirmation:**
   - An **Order Pass** modal opens immediately showing:
     - **Unique Order ID** (e.g. `#MM-84920`)
     - **Scannable QR Code**
     - **Secret 4-digit PIN** (e.g. `PIN: 7391`)
   - Click **"View in My Orders"** to see your order history and track status.

---

### Step 5: Seller Fulfills Order & Verifies PIN
*Simulate the seller handing over the order and verifying pickup.*

1. Switch back or log into the **Seller Account** (`campustreats@mondaymart.in`).
2. Navigate to the **"Active Orders"** tab in the Seller Dashboard.
3. You will see the incoming order card in real-time with:
   - Customer Name & items ordered
   - Order timestamp and total amount
   - Order Status (`Pending`)
4. Change the status tag to **"Preparing"**, then **"Ready for Pickup"** as the food is made.
5. **Pickup Handover:**
   - The customer walks to the counter and shares their secret 4-digit PIN (e.g. `7391`) or shows their QR Code.
   - The seller enters `7391` in the **"Enter 4-digit Pickup PIN"** field on the order ticket.
   - Click **"Verify PIN"** (or use **"Quick Demo Verify"**).
6. **Order Completed:**
   - The card border turns emerald green with a **"Fulfilled"** checkmark.
   - Stock in Firestore has automatically been deducted!
   - The Total Revenue counter on the seller dashboard increases by the order amount.

---

## 🔍 How to Verify in Firebase Console

If you want to see your live Cloud Firestore database updating in real-time:

1. Open your [Firebase Console](https://console.firebase.google.com/).
2. Select project **`monday-mart-27b80`**.
3. In the left sidebar, click **Build** → **Firestore Database** → **Data** tab.
4. As you perform the steps above, you will see 4 live collections:
   - **`users`**: Contains the admin, approved sellers, and registered customers.
   - **`pendingSellers`**: Contains the seller application and approval history.
   - **`products`**: Contains all live menu items created by sellers.
   - **`orders`**: Contains all placed orders with items, pricing, QR payload, and verification status.

---

## 💡 Quick Tips for Testers

- **Switching Roles Fast:** You can click the user profile icon on the top-right and click **Logout** anytime to switch between Customer, Seller, and Admin.
- **Multiple Browsers:** Open one standard browser tab for the **Seller** and one **Incognito tab** for the **Customer** to see real-time updates without logging out!
- **Offline / Network Resilience:** If your internet or Firebase drops momentarily, MondayMart has built-in graceful local fallback so you will not lose your progress.
