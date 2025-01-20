import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/entities/order.entity';

@Injectable()
export class OrderReceipt {
  generateProcessing(info: string, order: Order) {
    let orderItems = '';
    order.items.forEach((item) => {
      orderItems += `<tr>
                    <td> 
                        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" alt="image" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                    </td>
                    <td style="text-align: left; padding: 10px 8px;">
                      <span style="font-size: 14px; color: #555;">${item.product.name}</span>
                    </td>
                    <td style="text-align: left; padding: 10px 8px; font-size: 14px; color: #555;">₦${this.formatAccounting(item.product.sellingPrice)}</td>
                    <td style="text-align: left; padding: 10px 8px; font-size: 14px; color: #555;">${item.quantity}</td>
                    <td style="text-align: left; padding: 10px 8px; font-size: 14px; color: #555;">₦${this.formatAccounting(item.product.sellingPrice * item.quantity)}</td>
                  </tr>`;
    });
    return `<table style="width: 100%;">
    <tr>
      <td style="text-align: center;">
        <table style="max-width: 600px; width: 100%; background-color: #fff;">
          <tr>
            <td>
              <p style="font-size: 14px; margin: 10px 0; text-align: center;">${info}</p>
              <div style="margin-top: 20px;">
                <h2 style="font-size: 18px; margin-bottom: 10px;">Order Summary</h2>
                <p style="font-size: 14px; color: #555; margin: 5px 0;">Order Number: <strong>#${order.reference}</strong></p>
                <p style="font-size: 14px; color: #555; margin: 5px 0;">Order Date: <strong>${this.getDate(order.createdAt)}</strong></p>
                <p style="font-size: 14px; color: #555; margin: 5px 0;">Delivery Address: <strong>${order.shipments[0].address}, ${order.shipments[0].location.name}</strong></p>
                <p style="font-size: 14px; color: #555; margin: 5px 0;">Expected Delivery Date: <strong>${this.getDate(order.shipments[0].expectedDeliveryDate)}</strong></p>
              </div>
              <h3 style="font-size: 18px; margin-top: 30px;">Your Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 8px; font-size: 14px; color: #555;"></th>
                    <th style="text-align: left; padding: 8px; font-size: 14px; color: #555;">Product</th>
                    <th style="text-align: left; padding: 8px; font-size: 14px; color: #555;">Price</th>
                    <th style="text-align: left; padding: 8px; font-size: 14px; color: #555;">Quantity</th>
                    <th style="text-align: left; padding: 8px; font-size: 14px; color: #555;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
              </table>
              <div style="text-align: right; margin-top: 20px;">
                <p style="font-size: 14px; font-weight: bold; color: #232f3e;">Subtotal: <span style="font-size: 14px;">₦${this.formatAccounting(order.shipments[0].amount)}</span></p>
                <p style="font-size: 14px; font-weight: bold; color: #232f3e;">Delivery Fee: <span style="font-size: 14px;">₦${this.formatAccounting(order.shipments[0].deliveryFee)}</span></p>
                <p style="font-size: 14px; font-weight: bold; color: #232f3e;">Tax: <span style="font-size: 14px;">₦${this.formatAccounting(order.shipments[0].tax)}</span></p>
                <p style="font-size: 14px; font-weight: bold; color: #232f3e;">Discount: <span style="font-size: 14px;">- ₦${this.formatAccounting(order.shipments[0].discount)}</span></p>
                <p style="font-size: 18px; font-weight: bold; color: #232f3e;">Total: <span style="font-size: 18px; color: #d9534f;">₦${this.formatAccounting(order.shipments[0].amountToPay)}</span></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
  }

  formatAccounting(number: number) {
    if (!number) {
      return 'N/A';
    }
    const formatter = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(Math.abs(number));
    return number < 0 ? `(${formatted})` : formatted;
  }

  getDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Lagos',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = date.toLocaleString('en-GB', options);
    return this.addOrdinalSuffix(formattedDate);
  }

  addOrdinalSuffix(dateStr: string): string {
    const [day, ...rest] = dateStr.split(' ');
    const dayWithSuffix = day + this.getOrdinalSuffix(parseInt(day));
    return [dayWithSuffix, ...rest].join(' ');
  }

  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
