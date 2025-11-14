import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import StatCard from '../../components/admin/StatCard';
// Icons are defined inline below
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icon components
const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const ShoppingCartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const DollarSignIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await api.get('/api/admin/dashboard/overview');
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      setError(errorMessage);
      // Set fallback data if API fails
      setDashboardData({
        summary: {
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalCategories: 0,
          totalRevenue: 0,
          newUsersThisMonth: 0,
          lowStockProducts: 0,
        },
        salesTrend: [],
        trendingProducts: [],
        recentOrders: [],
        orderStatusBreakdown: {},
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  // Use fallback data if API failed
  const data = dashboardData || {
    summary: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalCategories: 0,
      totalRevenue: 0,
      newUsersThisMonth: 0,
      lowStockProducts: 0,
    },
    salesTrend: [],
    trendingProducts: [],
    recentOrders: [],
    orderStatusBreakdown: {},
  };

  const { summary, salesTrend, trendingProducts, recentOrders } = data;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Warning: {error}</p>
          <p className="text-sm mt-1">Showing fallback data. Please check your backend connection.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={summary.totalUsers.toLocaleString()}
          change={12}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={summary.totalProducts.toLocaleString()}
          change={5}
          icon={PackageIcon}
          color="purple"
        />
        <StatCard
          title="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          change={8}
          icon={ShoppingCartIcon}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          change={15}
          icon={DollarSignIcon}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
          {salesTrend && salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} name="Sales ($)" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No sales data available
            </div>
          )}
        </motion.div>

        {/* Trending Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {trendingProducts && trendingProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendingProducts.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSold" fill="#0ea5e9" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No product data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders & Trending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No recent orders</div>
            )}
          </div>
        </motion.div>

        {/* Trending Products List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Products</h3>
          <div className="space-y-3">
            {trendingProducts && trendingProducts.length > 0 ? (
              trendingProducts.slice(0, 5).map((product, index) => (
              <div key={product.productId || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <PackageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${product.totalRevenue}</p>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No trending products</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

