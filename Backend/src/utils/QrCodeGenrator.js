import QRCode from "qrcode";
 export const  generateQRCode = async(value)=>{
        const qrData = JSON.stringify({
            sku:value
        })
        const QRimage = await QRCode.toDataURL(qrData);
        return QRimage;
 }