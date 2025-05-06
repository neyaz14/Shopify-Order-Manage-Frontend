/* eslint-disable react/prop-types */

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  section: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoSection: {
    width: 50,
    height: 50,
    backgroundColor: '#8c8cc4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginBottom: 50,
  },
  logoText: {
    color: 'white',
    fontSize: 13,
    
    textAlign: 'center',
  },
  invoiceDetails: {
    textAlign: 'right',
    fontSize: 12,
  },
  companyDetails: {
    fontSize: 11,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerDetails: {
    width: 250,
    fontSize: 11,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    marginBottom: 15,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 9,
  },
  productCell: {
    flex: 2,
  },
  optionsCell: {
    flex: 2,
  },
  quantityCell: {
    flex: 1,
    textAlign: 'center',
  },
  priceCell: {
    flex: 1,
    textAlign: 'right',
  },
  totalCell: {
    flex: 1,
    textAlign: 'right',
  },
  summarySection: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
    fontSize: 10,
    marginBottom: 3,
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  paymentInfoSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  pendingWatermark: {
    position: 'absolute',
    left: 200,
    top: 450,
    transform: 'rotate(-15deg)',
    opacity: 0.5,
  },
  pendingText: {
    fontSize: 30,
    color: '#888',
    fontWeight: 'bold',
    border: '3px solid #888',
    padding: 10,
  }
});

const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header Section with Logo and Invoice Details */}
      <View style={styles.header}>
        <View>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>SACE LADY</Text>
          </View>
          <View style={styles.companyDetails}>
            <Text>{invoiceData?.company?.name || ''}</Text>
            <Text>{invoiceData?.company?.address || ''}</Text>
            
            <Text>{invoiceData?.company?.phone || ''}</Text>
            <Text>{invoiceData?.company?.email || ''}</Text>
            <Text>Tax ID: {invoiceData?.company?.taxId || ''}</Text>
          </View>
        </View>
        <View style={styles.invoiceDetails}>
          <Text>{invoiceData?.date || ''}</Text>
          <Text>Invoice: {invoiceData?.invoiceNumber || ''}</Text>
          <Text>Order ID: {invoiceData?.orderID || ''}</Text>
        </View>
      </View>

      {/* Customer Information Row */}
      <View style={styles.row}>
        <View>
          <Text style={{ fontWeight: 'bold' }}>{invoiceData?.customer?.name || ''}</Text>
          <Text>{invoiceData?.customer?.email || ''}</Text>
        </View>
        <View style={styles.customerDetails}>
          <Text>Customer Address: {invoiceData?.customer?.address || ''}</Text>
          <Text>{invoiceData?.customer?.phone || ''}</Text>
        </View>
      </View>

      {/* Product Table */}
      <View style={[styles.section, { marginTop: 20 }]}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.productCell}>PRODUCT</Text>
          <Text style={styles.optionsCell}>OPTIONS</Text>
          <Text style={styles.quantityCell}>QUANTITY</Text>
          <Text style={styles.priceCell}>PRICE</Text>
          <Text style={styles.totalCell}>TOTAL</Text>
        </View>

        {/* Table Rows */}
        {invoiceData?.items?.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.productCell}>{item?.name || ''}</Text>
            <Text style={styles.optionsCell}>{item?.options || ''}</Text>
            <Text style={styles.quantityCell}>{item?.quantity || 0}</Text>
            <Text style={styles.priceCell}>Tk. {item?.price?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.totalCell}>Tk. {item?.total || 0}</Text>
          </View>
        ))}
      </View>

      {/* Pending Watermark */}
      {invoiceData?.payment?.status?.toLowerCase() === 'pending' && (
        <View style={styles.pendingWatermark}>
          <Text style={styles.pendingText}>PENDING</Text>
        </View>
      )}

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text>Quantity</Text>
          <Text>{invoiceData?.summary?.quantity || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>Tk. {invoiceData?.summary?.subtotal || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Shipping fee</Text>
          <Text>Tk. {invoiceData?.summary?.shippingFee || 0}</Text>
        </View>
        <View style={styles.totalAmountRow}>
          <Text>TOTAL AMOUNT</Text>
          <Text>Tk. {invoiceData?.summary?.totalAmount || 0}</Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentInfoSection}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>PAYMENT INFO</Text>
        <Text>Payment method: {invoiceData?.payment?.method || ''}</Text>
        <Text>Payment status: {invoiceData?.payment?.status || ''}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>*No exchanges or refunds for used liquid/semi-liquid products; see details at Returns & Refunds Policy.</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;