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
import { Bell, Plus, Edit, Trash2 } from 'lucide-react';

const AddEditNotificationModal = ({ isOpen, onClose, onSave, notification }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        targetAudience: notification.targetAudience,
      });
    } else {
      setFormData({ title: '', message: '', type: 'info', targetAudience: 'all' });
    }
  }, [notification]);

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
          <DialogTitle>{notification ? 'Edit Notification' : 'Create Notification'}</DialogTitle>
          <DialogDescription>
            {notification ? 'Edit the details of this notification.' : 'Fill in the details to create a new notification.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <Textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
          <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="promo">Promo</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleSelectChange('targetAudience', value)} value={formData.targetAudience}>
            <SelectTrigger>
              <SelectValue placeholder="Select Target Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="specific_users">Specific Users</SelectItem>
              <SelectItem value="category_based">Category Based</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotification = async (notificationData) => {
    try {
      if (editingNotification) {
        await api.put(`/api/admin/notifications/${editingNotification._id}`, notificationData);
      } else {
        await api.post('/api/admin/notifications', notificationData);
      }
      setIsModalOpen(false);
      setEditingNotification(null);
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/api/admin/notifications/${id}`);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const openModalToAdd = () => {
    setEditingNotification(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (notification) => {
    setEditingNotification(notification);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AddEditNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNotification}
        notification={editingNotification}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Manage Notifications</CardTitle>
          <Button onClick={openModalToAdd}>
            <Plus className="mr-2 h-4 w-4" /> Create Notification
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
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
              <p className="mt-1 text-sm">Create a new notification to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-muted-foreground">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Title</th>
                    <th scope="col" className="px-6 py-3">Target</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <motion.tr
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-muted"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{notification.title}</td>
                      <td className="px-6 py-4">{notification.targetAudience}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {notification.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModalToEdit(notification)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(notification._id)}>
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

export default NotificationsPage;