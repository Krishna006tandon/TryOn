import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import StatCard from '../../components/admin/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';

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
      const response = await api.get('/admin/dashboard/overview');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-32"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
          <Card className="h-32"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
          <Card className="h-32"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
          <Card className="h-32"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 h-80"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
          <Card className="col-span-3 h-80"><CardContent className="h-full animate-pulse bg-muted rounded-lg" /></Card>
        </div>
      </div>
    );
  }

  const data = dashboardData || {
    summary: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, revenueChange: 0 },
    salesTrend: [],
    recentOrders: [],
  };

  const { summary, salesTrend, recentOrders } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {error && (
        <Card className="bg-destructive/10 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Warning: {error}</CardTitle>
            <CardDescription className="text-destructive/80">
              Showing fallback data. Please check your backend connection.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description={`${(summary.revenueChange ?? 0) > 0 ? '+' : ''}${(summary.revenueChange ?? 0).toFixed(1)}% from last month`}
        />
        <StatCard
          title="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          description="Active orders in the system"
        />
        <StatCard
          title="Total Users"
          value={summary.totalUsers.toLocaleString()}
          icon={Users}
          description="Registered customers"
        />
        <StatCard
          title="Total Products"
          value={summary.totalProducts.toLocaleString()}
          icon={Package}
          description="Available items in store"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }} />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Sales" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have {recentOrders.length} recent orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                    <div className="ml-auto font-medium">+${order.total.toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent orders</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;