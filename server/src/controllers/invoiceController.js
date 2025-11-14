import Order from '../models/Order.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate PDF invoice
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const invoiceDir = path.join(__dirname, '../../invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const fileName = `invoice-${order.orderNumber}-${Date.now()}.pdf`;
    const filePath = path.join(invoiceDir, fileName);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('TryOn Collective', 50, 50);
    doc.fontSize(10).text('Invoice', 50, 80);
    doc.fontSize(10).text(`Order #: ${order.orderNumber}`, 50, 100);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 115);

    // Customer Info
    doc.fontSize(12).text('Bill To:', 350, 80);
    doc.fontSize(10);
    if (order.userId) {
      doc.text(order.userId.name, 350, 100);
      doc.text(order.userId.email, 350, 115);
    }
    if (order.shippingAddress) {
      doc.text(order.shippingAddress.street || '', 350, 130);
      doc.text(
        `${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`,
        350,
        145
      );
    }

    // Items Table
    let y = 200;
    doc.fontSize(12).text('Items', 50, y);
    y += 20;

    // Table Header
    doc.fontSize(10);
    doc.text('Item', 50, y);
    doc.text('Quantity', 250, y);
    doc.text('Price', 350, y);
    doc.text('Total', 450, y);
    y += 15;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    // Items
    order.items.forEach((item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      doc.text(item.name || 'Product', 50, y);
      doc.text(String(item.quantity || 1), 250, y);
      doc.text(`$${(item.price || 0).toFixed(2)}`, 350, y);
      doc.text(`$${itemTotal.toFixed(2)}`, 450, y);
      y += 20;
    });

    y += 10;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 20;

    // Totals
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 350, y);
    y += 15;
    if (order.discount > 0) {
      doc.text(`Discount: -$${order.discount.toFixed(2)}`, 350, y);
      y += 15;
    }
    if (order.rewardPointsUsed > 0) {
      doc.text(`Reward Points: -$${(order.rewardPointsUsed / 100).toFixed(2)}`, 350, y);
      y += 15;
    }
    if (order.shipping > 0) {
      doc.text(`Shipping: $${order.shipping.toFixed(2)}`, 350, y);
      y += 15;
    }
    if (order.tax > 0) {
      doc.text(`Tax: $${order.tax.toFixed(2)}`, 350, y);
      y += 15;
    }
    doc.fontSize(12).text(`Total: $${order.total.toFixed(2)}`, 350, y);

    // Footer
    y = 700;
    doc.fontSize(8).text('Thank you for your purchase!', 50, y, { align: 'center' });
    doc.text('TryOn Collective - Premium Fashion Store', 50, y + 15, { align: 'center' });

    doc.end();

    // Wait for PDF to be written
    stream.on('finish', async () => {
      // Update order with invoice URL
      const invoiceUrl = `/invoices/${fileName}`;
      order.invoiceUrl = invoiceUrl;
      await order.save();

      // Send file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      fs.createReadStream(filePath).pipe(res);

      // Clean up after sending (optional - you might want to keep invoices)
      // setTimeout(() => fs.unlinkSync(filePath), 60000);
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
};

// Get invoice URL
export const getInvoiceUrl = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.invoiceUrl) {
      return res.status(404).json({ error: 'Invoice not generated yet' });
    }

    res.json({ invoiceUrl: order.invoiceUrl });
  } catch (error) {
    console.error('Error getting invoice URL:', error);
    res.status(500).json({ error: 'Failed to get invoice URL' });
  }
};

// Serve invoice file
export const serveInvoice = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../../invoices', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error serving invoice:', error);
    res.status(500).json({ error: 'Failed to serve invoice' });
  }
};

