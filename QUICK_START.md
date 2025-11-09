# Quick Start Guide - Payment & Sales Dashboard

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Development Server

```bash
cd e:\rest\frontend\hotel-frontend
npm run dev
```

### Step 2: Login as Admin

1. Navigate to `http://localhost:5173/staff-login`
2. Login with admin credentials
3. You'll be redirected to `/admin/dashboard`

### Step 3: Explore the New Features

Click on any of the new Quick Action buttons or use the sidebar navigation!

---

## 📊 Feature Overview

### 1. Analytics Dashboard (`/admin/analytics`)

**What you'll see:**

- 4 metric cards showing overview stats
- Revenue trends chart with customizable time periods
- Order status distribution pie chart
- Sales by category bar chart
- Location performance metrics
- Top 10 selling items table
- Top 10 customers table

**What you can do:**

- Change date ranges using the date filter
- Filter by specific location
- Change revenue trend grouping (hourly, daily, weekly, monthly, yearly)
- View detailed item information with images
- Identify best-performing locations

**Use Cases:**

- Daily revenue monitoring
- Identify trending menu items
- Compare location performance
- Track customer spending patterns
- Monitor order status distribution

---

### 2. Payments Management (`/admin/payments`)

**What you'll see:**

- Payment statistics (total payments, successful, revenue, avg order value)
- Searchable payments table with customer and order details
- Advanced filtering options

**What you can do:**

- Search by customer name, email, phone, or order number
- Filter by payment status (paid, pending, failed)
- Filter by location
- Filter by date range
- Sort by amount or date
- Paginate through large datasets
- Auto-refresh every 30 seconds

**Use Cases:**

- Track payment failures
- Search for specific transactions
- Monitor daily payment collection
- Verify customer payments
- Reconcile with bank statements

---

### 3. Sales Management (`/admin/sales`)

**What you'll see:**

- Sales statistics (total sales, revenue, average sale value)
- Sales breakdown by location
- Detailed sales table with payment information

**What you can do:**

- Filter by location
- Filter by date range
- View sales breakdown (subtotal, tax, service charge)
- Sort by amount or date
- Compare location performance
- Auto-refresh every 30 seconds

**Use Cases:**

- Daily sales reporting
- Compare location sales
- Track tax collection
- Monitor payment methods
- Identify sales patterns

---

## 🎯 Common Tasks

### View Today's Revenue

1. Go to Analytics Dashboard
2. Date filter automatically shows current data
3. Check "Total Revenue" metric card

### Find a Specific Payment

1. Go to Payments Management
2. Use the search box
3. Type customer name, email, phone, or order number
4. View filtered results

### Compare Location Performance

1. Go to Analytics Dashboard
2. Scroll to "Location Performance" chart
3. See revenue and orders for each location

### Check Failed Payments

1. Go to Payments Management
2. Filter by Status: "Failed"
3. Review failed transactions

### Export/Print Reports

Currently not implemented, but you can:

1. Use browser's Print function (Ctrl+P)
2. Screenshot important metrics
3. Copy table data manually

---

## 🔄 Date Range Shortcuts

Quick select options available in date filters:

- **Today**: Current day only
- **Yesterday**: Previous day
- **Last 7 Days**: Past week including today
- **Last 30 Days**: Past month including today
- **This Month**: First day of month to today
- **Last Month**: Complete previous month
- **All Time**: No date filter (default)

---

## 📱 Mobile Access

All pages are fully responsive:

- On mobile: Tables scroll horizontally
- Cards stack vertically
- Charts adapt to screen size
- Sidebar becomes a drawer menu

---

## ⚡ Performance Tips

1. **Use Date Filters**: Filtering by date range improves load times
2. **Location Filters**: Filter by specific location for faster queries
3. **Pagination**: Use pagination instead of loading all records
4. **Auto-Refresh**: Data auto-refreshes every 30-60 seconds
5. **Manual Refresh**: Click refresh button for immediate updates

---

## 🔐 Access Control

**Admin Only Access**: These pages are only accessible to users with ADMIN role.

If you see "Access Denied":

- Check you're logged in as Admin
- Verify your user role in Profile

---

## 🎨 UI Components Used

### Cards

```
┌─────────────────────┐
│ Total Revenue       │
│ ₹25,430.50     +12%│
│              [icon]│
└─────────────────────┘
```

### Filters

```
[Quick Select ▼] [Date Range Picker] [Refresh]
[Search...] [Location ▼] [Status ▼]
```

### Tables

```
Order# | Customer | Location | Amount | Status | Date
-------|----------|----------|--------|--------|------
ORD-1  | John Doe | Branch 1 | ₹450   | Paid   | Today
```

### Charts

- Line Chart: Revenue trends over time
- Pie Chart: Order status distribution
- Bar Chart: Sales by category
- Progress Bars: Location performance

---

## 🐛 Troubleshooting

### Issue: No data showing

**Solution**:

- Check if backend API is running
- Verify your admin token is valid
- Try refreshing the page
- Check browser console for errors

### Issue: Charts not loading

**Solution**:

- Ensure recharts library is installed
- Check if data exists for the selected period
- Try different date range

### Issue: Filters not working

**Solution**:

- Clear filters and try again
- Check if API supports the filter parameter
- Verify backend is returning correct data

### Issue: Table pagination not working

**Solution**:

- Check API response includes pagination data
- Verify totalItems count is correct
- Try clearing cache

---

## 📞 Support

For issues or questions:

1. Check the browser console for errors
2. Verify API endpoints are working
3. Review PAYMENT_SALES_IMPLEMENTATION.md for technical details
4. Check network tab for API response errors

---

## 🎓 Learning Resources

### Understanding React Query

- Data is cached automatically
- Stale time: How long data is considered fresh
- Refetch interval: How often to auto-refresh
- Query keys: Unique identifiers for cached data

### Understanding the Flow

```
User Action
    ↓
React Component
    ↓
Custom Hook (usePayments)
    ↓
Service Function (paymentsApi.getPayments)
    ↓
API Request
    ↓
Backend Response
    ↓
React Query Cache
    ↓
Component Re-render
```

---

## ✨ Tips & Tricks

1. **Use Quick Actions**: Dashboard has quick action buttons for easy navigation
2. **Sidebar Menu**: New "Sales & Analytics" section in sidebar
3. **Keyboard**: Use Tab to navigate through filters
4. **Date Shortcuts**: Use preset date ranges for common periods
5. **Search**: Search box supports multiple fields at once
6. **Sort**: Click column headers to sort
7. **Export**: Use Ctrl+P to print current view

---

## 🎯 Next Steps

After familiarizing yourself with the features:

1. Customize filters based on your needs
2. Set up regular monitoring schedule
3. Share insights with your team
4. Provide feedback for improvements

---

**Happy Analyzing! 📊**
