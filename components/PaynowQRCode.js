// Sample PayNow QR code image (replace with your real QR code as needed)
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function PaynowQRCode() {
  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Image
        source={{ uri: 'https://www.ocbc.com/iwov-resources/sg/ocbc/personal/images/promo/paynow/qr-sample.png' }}
        style={{ width: 160, height: 160, borderRadius: 12, borderWidth: 1, borderColor: '#eee' }}
        resizeMode="contain"
      />
      <Text style={{ marginTop: 8, color: '#34495E', fontSize: 13 }}>Scan to Pay (Sample)</Text>
    </View>
  );
}
