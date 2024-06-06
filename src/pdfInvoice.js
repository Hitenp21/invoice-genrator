import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
} from "@react-pdf/renderer";
import styles from "./pdfInvoiceStyle";

const InvoiceTitle = ({pdfData}) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <Image style={styles.logo} src="/images/logo1.png" />
            <Text style={styles.reportTitle}> Sparrow Enterprises</Text>
        </View>
    </View>
);

const Address = ({pdfData}) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View>
                <Text style={styles.invoice}>Invoice </Text>
                <Text style={styles.invoiceNumber}>Invoice number: {pdfData.invoiceNo} </Text>
                <Text style={styles.invoiceNumber}>Supplier : <Text style={styles.name}>{pdfData.supplierName}</Text>  </Text>
                <Text style={styles.name}>GSTIN : {pdfData.supplierGstNo} </Text>
                <Text style={styles.addressTitle}>Address Supplier : {pdfData.supplierAddress}</Text>
            </View>
        </View>
    </View>
);

const UserAddress = ({pdfData}) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View style={{maxWidth : 200}}>
                <Text style={styles.addressTitle}>Details of Buyer (Bill to) : <Text style={styles.name}>{pdfData.username}</Text></Text>
                <Text style={styles.name}>GSTIN : {pdfData.buyerGstNo}</Text>
                <Text style={styles.address}>
                    Address : {pdfData.buyerAddress}
                </Text>
            </View>
            <Text style={styles.addressTitle}>{pdfData.date}</Text>
        </View>
    </View>
);

const TableHead = ({pdfData}) => (
    <View style={{ width:'100%', flexDirection :'row', marginTop:10}}>
        <View style={[styles.theader, styles.theader2]}>
            <Text >Product Name</Text>   
        </View>
        <View style={styles.theader}>
            <Text>Pcs per Box</Text>   
        </View>
        <View style={styles.theader}>
            <Text>Box</Text>   
        </View>
        <View style={styles.theader}>
            <Text>Price</Text>   
        </View>
        <View style={styles.theader}>
            <Text>Amount</Text>   
        </View>
    </View>
);

const TableBody = ({pdfData}) => (
    pdfData?.products?.map((receipt)=>(
     <Fragment key={receipt.id}>
         <View style={{ width:'100%', flexDirection :'row'}}>
             <View style={[styles.tbody, styles.tbody2]}>
                 <Text >{receipt.name}</Text>   
             </View>
             <View style={styles.tbody}>
                 <Text>{receipt.qty}</Text>   
             </View>
             <View style={styles.tbody}>
                 <Text>{receipt.dQty}</Text>   
             </View>
             <View style={styles.tbody}>
                 <Text>{receipt.price} </Text>   
             </View>
             <View style={styles.tbody}>
                 <Text>{receipt.amount}</Text>   
             </View>
         </View>
     </Fragment>
    ))
 );


 const TableTotal = ({pdfData}) => (
    <>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>Sub Total</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.subTotal}
            </Text>  
        </View>
    </View>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>GST</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.gst}
            </Text>  
        </View>
    </View>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>TAX</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.tax}
            </Text>  
        </View>
    </View>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>Remaining Payment</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.remainingPayment}
            </Text>  
        </View>
    </View>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>Receive Payment</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.receivedPayment}
            </Text>  
        </View>
    </View>
    <View style={{ width:'100%', flexDirection :'row'}}>
        <View style={styles.total}>
            <Text></Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.total}>
            <Text> </Text>   
        </View>
        <View style={styles.tbody}>
            <Text>Total</Text>   
        </View>
        <View style={styles.tbody}>
            <Text>
                {pdfData.total}
            </Text>  
        </View>
    </View>
    </>
);
 
const PdfInvoice = ({data}) => {
  return (
    
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle pdfData={data} />
        <Address pdfData={data} />
        <UserAddress pdfData={data} />
        <TableHead pdfData={data} />
        <TableBody pdfData={data} />
        <TableTotal pdfData={data} />
      </Page>
    </Document>
  );
};
export default PdfInvoice;
