# Payment and Sales Management System - Frontend Implementation

## Overview

This implementation provides a comprehensive admin dashboard for managing payments, sales, and analytics for the restaurant management system. It includes modular components, custom hooks, and services that follow best practices.

## 🎯 Features Implemented

### 1. **Payments Management** (`/admin/payments`)

- View all payment transactions with advanced filtering
- Search by customer name, email, phone, or order number
- Filter by payment status, location, and date range
- Pagination support with sortable columns
- Real-time payment statistics dashboard
- Detailed payment information including order items

### 2. **Sales Management** (`/admin/sales`)

- Track all sales transactions
- Filter by location and date range
- View sales breakdown by location
- Sales statistics with revenue metrics
- Detailed sales information with order details

### 3. **Analytics Dashboard** (`/admin/analytics`)

- **Overview Metrics**: Total revenue, orders, customers, average order value
- **Revenue Trends**: Line chart with customizable time periods (hourly, daily, weekly, monthly, yearly)
- **Order Status Distribution**: Pie chart showing order statuses
- **Sales by Category**: Bar chart showing performance by menu category
- **Location Performance**: Progress bars showing revenue by location
- **Top Selling Items**: Table with images, quantities, and revenue
- **Top Customers**: Table showing best customers by spending

## 📁 Project Structure

```
src/
├── services/
│   ├── payments.ts          # Payment API service
│   ├── sales.ts             # Sales API service
│   └── dashboard.ts         # Dashboard analytics API service
│
├── hooks/
│   ├── usePayments.ts       # React Query hooks for payments
│   ├── useSales.ts          # React Query hooks for sales
│   └── useDashboard.ts      # React Query hooks for analytics
│
├── components/
│   └── admin/
│       ├── MetricCard.tsx        # Reusable stat card component
│       ├── DateFilter.tsx        # Date range filter with presets
│       └── EmptyState.tsx        # Empty state component
│
├── pages/
│   └── admin/
│       ├── PaymentsManagement.tsx    # Payments page
│       ├── SalesManagement.tsx       # Sales page
│       └── AnalyticsDashboard.tsx    # Analytics page
│
└── layouts/
    └── DashboardLayout.tsx           # Updated with new nav items
```

## 🔧 Technical Implementation

### Services Layer

All API calls are centralized in service files with proper TypeScript typing:

```typescript
// Example: payments.ts
export const paymentsApi = {
  getPayments: async (filters?: PaymentFilters) => {...},
  getPayment: async (id: string) => {...},
  getPaymentsByUser: async (userId: string) => {...},
  getPaymentStats: async (filters?) => {...},
};
```

### Custom Hooks with React Query

All data fetching uses React Query for optimal caching and real-time updates:

```typescript
// Example: usePayments.ts
export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: PAYMENTS_KEYS.list(filters || {}),
    queryFn: () => paymentsApi.getPayments(filters),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};
```

### Reusable Components

- **MetricCard**: Displays statistics with icons, trends, and loading states
- **DateFilter**: Date range picker with quick select presets (Today, Last 7 Days, etc.)
- **EmptyState**: Consistent empty state messaging

## 🎨 UI/UX Features

### Design Consistency

- Dark theme with gradient backgrounds
- Consistent color scheme (orange/green accents)
- Responsive design for all screen sizes
- Ant Design components for professional look

### User Experience

- Real-time data updates (30s polling for critical data)
- Loading states for all async operations
- Empty states with helpful messages
- Sortable and filterable tables
- Search functionality with debouncing
- Mobile-responsive layouts

## 🔗 Navigation

### Updated Routes

```typescript
// Admin-only routes
<Route path="/admin/payments" element={<PaymentsManagement />} />
<Route path="/admin/sales" element={<SalesManagement />} />
<Route path="/admin/analytics" element={<AnalyticsDashboard />} />
```

### Sidebar Navigation

Added new section "Sales & Analytics" with three sub-items:

- Analytics Dashboard
- Payments
- Sales

### Dashboard Quick Actions

Updated Admin Dashboard with direct links to:

- Analytics
- Payments
- Sales

## 📊 Charts and Visualizations

Using **Recharts** library for data visualization:

1. **Line Chart** - Revenue trends over time
2. **Pie Chart** - Order status distribution
3. **Bar Chart** - Sales by category
4. **Progress Bars** - Location performance

## 🔄 Data Flow

```
Component → Hook → Service → API
    ↓
React Query Cache
    ↓
Auto-refresh / Manual refresh
```

## 🚀 Getting Started

### Prerequisites

```bash
# Already installed:
- React Query (@tanstack/react-query)
- Ant Design (antd)
- Recharts (recharts)
- Day.js (dayjs)
- Axios (axios)
```

### Running the Application

```bash
npm run dev
```

### Accessing the Features

1. Login as Admin user
2. Navigate to Admin Dashboard
3. Use sidebar or quick action buttons to access:
   - `/admin/analytics` - Analytics Dashboard
   - `/admin/payments` - Payments Management
   - `/admin/sales` - Sales Management

## 🔐 Security

- All routes protected with admin-only access
- Bearer token authentication via axios interceptors
- Protected routes using `ProtectedRouteStaff` component

## 📱 Responsive Design

All pages are fully responsive with breakpoints:

- **xs** (< 576px): Mobile
- **sm** (≥ 576px): Small tablets
- **md** (≥ 768px): Tablets
- **lg** (≥ 992px): Desktops
- **xl** (≥ 1200px): Large desktops

## 🎯 API Integration Points

### Payments APIs

- `GET /admin/payments` - List all payments
- `GET /admin/payments/:id` - Get payment by ID
- `GET /admin/payments/user/:userId` - Get user payments
- `GET /admin/payments-stats` - Get payment statistics

### Sales APIs

- `GET /admin/sales` - List all sales
- `GET /admin/sales/:id` - Get sale by ID
- `GET /admin/sales/location/:locationId` - Get location sales
- `GET /admin/sales-stats` - Get sales statistics

### Dashboard APIs

- `GET /admin/dashboard/metrics` - Overview metrics
- `GET /admin/dashboard/most-sold-items` - Top selling items
- `GET /admin/dashboard/revenue-trends` - Revenue trends
- `GET /admin/dashboard/sales-by-category` - Category sales
- `GET /admin/dashboard/top-customers` - Top customers
- `GET /admin/dashboard/order-status-distribution` - Order statuses
- `GET /admin/dashboard/location-performance` - Location performance

## 🔧 Configuration

### API Base URL

Configured in `src/services/api.ts`:

```typescript
baseURL: import.meta.env.VITE_API_URL ||
  "https://hotel-backend-ky3q.onrender.com";
```

### React Query Cache Settings

- **Stale Time**: 2-5 minutes (varies by endpoint)
- **Refetch Interval**: 30-60 seconds (for real-time data)
- **Retry**: 3 attempts on failure

## 🎨 Customization

### Colors

Primary colors defined in tailwind/antd config:

- Primary: `#fb923c` (Orange)
- Success: `#4ade80` (Green)
- Background: `#0f172a` (Dark Blue)
- Card Background: `#1e293b` (Slate)

### Metrics Card Customization

```typescript
<MetricCard
  title="Total Revenue"
  value={stats?.totalRevenue || 0}
  prefix="₹"
  precision={2}
  icon={<DollarOutlined />}
  trend={{ value: 12, direction: "up" }}
/>
```

## 📈 Performance Optimizations

1. **React Query Caching** - Reduces API calls
2. **Pagination** - Limits data loaded at once
3. **Lazy Loading** - Components load on demand
4. **Debounced Search** - Reduces search API calls
5. **Memoization** - Prevents unnecessary re-renders

## 🧪 Testing Recommendations

### Manual Testing Checklist

- [ ] Login as admin user
- [ ] Navigate to each new page
- [ ] Test all filters (date, location, status)
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Test sorting
- [ ] Test responsive design on mobile
- [ ] Test with empty data states
- [ ] Test with large datasets
- [ ] Test auto-refresh functionality

## 🐛 Known Considerations

1. **Date Timezone** - Ensure backend returns dates in ISO format
2. **Image Loading** - Menu item images should have fallback
3. **Currency** - Currently set to ₹ (INR)
4. **Permissions** - Requires ADMIN role

## 🔄 Future Enhancements

1. **Export Functionality** - Export reports to CSV/PDF
2. **Advanced Filters** - More filtering options
3. **Date Comparison** - Compare periods
4. **Real-time Notifications** - WebSocket integration
5. **Customizable Dashboard** - Drag-and-drop widgets
6. **Print Reports** - Printable versions
7. **Email Reports** - Scheduled email reports

## 📚 Dependencies

### Core Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching/caching
- `antd` - UI components
- `recharts` - Charts and graphs
- `dayjs` - Date manipulation
- `axios` - HTTP client

### Dev Dependencies

- `typescript` - Type safety
- `vite` - Build tool

## 🤝 Contributing

When adding new features:

1. Follow existing file structure
2. Create services, hooks, and components
3. Use TypeScript for type safety
4. Implement error handling
5. Add loading states
6. Make responsive designs
7. Update navigation/routes
8. Document changes

## 📝 Notes

- All monetary values are in INR (₹)
- Dates are formatted using dayjs
- Tables use Ant Design Table component
- Charts use Recharts library
- State management uses React Query
- Authentication uses Zustand store

## 🎉 Conclusion

This implementation provides a professional, scalable, and maintainable solution for managing payments, sales, and analytics in the restaurant management system. The modular architecture makes it easy to extend and customize based on specific requirements.

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
