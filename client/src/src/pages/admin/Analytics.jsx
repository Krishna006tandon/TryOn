import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import Skeleton from '../../components/admin/Skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import StatCard from '../../components/admin/dashboard/StatCard';
import { BarChart3, Users, Package, ShoppingCart, DollarSign, Lightbulb } from 'lucide-react';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/analytics/sales');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true);
      const response = await api.get('/api/admin/analytics/ai-insights');
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
              </div>
            </div>
          ) : !analytics ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">Could not load analytics</h3>
              <p className="mt-1 text-sm">Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Revenue" value={`$${analytics.summary.totalRevenue.toFixed(2)}`} icon={DollarSign} />
                <StatCard title="Total Orders" value={analytics.summary.totalOrders} icon={ShoppingCart} />
                <StatCard title="Total Users" value={analytics.summary.totalUsers} icon={Users} />
                <StatCard title="Total Products" value={analytics.summary.totalProducts} icon={Package} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Monthly Sales</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.monthlySales}>
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
                        <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Sales ($)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {analytics.topProducts.map(p => (
                        <li key={p.productId} className="flex items-center gap-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover border" />
                          <div>
                            <p className="font-semibold text-foreground">{p.name}</p>
                            <p className="text-sm text-muted-foreground">{p.totalSold} sold</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={fetchInsights} disabled={loadingInsights} className="mb-4">
                    <Lightbulb className="mr-2 h-4 w-4" /> {loadingInsights ? 'Generating...' : 'Get AI Insights'}
                  </Button>
                  {insights && <div className="prose max-w-none text-foreground">{insights}</div>}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsPage;