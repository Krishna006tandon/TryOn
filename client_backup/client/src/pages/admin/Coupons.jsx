import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import Skeleton from '../../components/admin/Skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Ticket, Plus, Edit, Trash2 } from 'lucide-react';

const AddEditCouponModal = ({ isOpen, onClose, onSave, coupon }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        validFrom: coupon.validFrom.split('T')[0],
        validUntil: coupon.validUntil.split('T')[0],
      });
    } else {
      setFormData({ code: '', description: '', discountType: 'percentage', discountValue: 0, validFrom: '', validUntil: '' });
    }
  }, [coupon]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          <DialogDescription>
            {coupon ? 'Edit the details of this coupon.' : 'Fill in the details to add a new coupon.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Input type="text" name="code" placeholder="Coupon Code" value={formData.code} onChange={handleChange} required />
          <Input type="number" name="discountValue" placeholder="Discount Value" value={formData.discountValue} onChange={handleChange} required />
          <Select onValueChange={(value) => handleSelectChange('discountType', value)} value={formData.discountType}>
            <SelectTrigger>
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required />
          <Input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} required />
          <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="md:col-span-2" />
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoupon = async (couponData) => {
    try {
      if (editingCoupon) {
        await api.put(`/api/admin/coupons/${editingCoupon._id}`, couponData);
      } else {
        await api.post('/api/admin/coupons', couponData);
      }
      setIsModalOpen(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/api/admin/coupons/${id}`);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const openModalToAdd = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AddEditCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCoupon}
        coupon={editingCoupon}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Manage Coupons</CardTitle>
          <Button onClick={openModalToAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Coupon
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">No coupons found</h3>
              <p className="mt-1 text-sm">Create a new coupon to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-muted-foreground">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Code</th>
                    <th scope="col" className="px-6 py-3">Discount</th>
                    <th scope="col" className="px-6 py-3">Validity</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <motion.tr
                      key={coupon._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-muted"
                    >
                      <td className="px-6 py-4 font-mono text-foreground">{coupon.code}</td>
                      <td className="px-6 py-4 text-foreground">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                      <td className="px-6 py-4 text-foreground">{new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModalToEdit(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(coupon._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CouponsPage;