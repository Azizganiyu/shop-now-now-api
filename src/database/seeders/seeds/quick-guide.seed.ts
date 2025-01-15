import { ISeeder } from '../seed.interface';
import { QuickGuide } from 'src/modules/quick-guide/entities/quick-guide.entity';

const values: QuickGuide[] = [
  {
    id: '4f5b29e2-d8c5-4a17-a8e8-123456789abc',
    title: 'HOW TO ORDER',
    body: 'Ordering your groceries and drinks on the Shopnownow app or website is as simple as ABC: Search; Pay; Receive. Simply search for the product you want to order, pay for it, and receive the order at your doorstep. The Shopnownow app is available on both the Google Play store and the iOS store. You can also visit the Shopnownow website @ www.shopnownow.app to order.',
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: '58a637b4-9c83-4e25-b432-abcdef123456',
    title: 'EARN LOYALTY POINTS',
    body: 'You automatically earn loyalty points every time you pay for orders on the Shopnownow app/website. You can convert those points to cash anytime and use them to make purchases on the app or website.',
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: '7e1f4c9a-6b25-40a3-a72b-654321fedcba',
    title: 'ENJOY FREE DELIVERY & 5% DISCOUNT ON BULK ORDERS',
    body: 'Order up to ₦100,000 worth of groceries on the Shopnownow app/website and enjoy free delivery to your doorstep. Also enjoy a 5% discount on bulk orders of ₦250,000 and above.',
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: 'abc45678-1234-4cba-9cde-789abcdef012',
    title: 'ENJOY 50% DELIVERY DISCOUNT',
    body: 'Enjoy up to 50% off delivery fees when you make orders during off-peak periods (9 am - 12 noon) from Monday to Friday every week.',
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: 'def01234-5678-9abc-cdef-0123456789ab',
    title: 'ENJOY 100% MONEY-BACK GUARANTEE',
    body: 'Be rest assured that we will refund you 100% of your cash should we deliver a wrong, expired, or defective product to you.',
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: 'fedcba98-7654-4321-ba98-abcdef654321',
    title: 'SEND SPECIAL REQUESTS',
    body: "Can't find it on Shopnownow? Simply click on the “Special Request” tab on the app/website and send us the name of the item(s) you want, and we promise to add it to our inventory for future purchases.",
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
  {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    title: 'SHARE THE GOOD NEWS',
    body: "Shopnownow is here to make life easier for everyone. It's like having a Personal Shopping Assistant at your fingertips. Get everything you need, quicker and cheaper from the comfort of your home or office. So don't just keep this good news to yourself, be nice and share with your friends and family too.",
    imageUrl:
      'https://nearpaysstorage.blob.core.windows.net/nearpayscontainer/fruit-basket_1736704782852.svg',
  },
];

export const QuickGuideSeed: ISeeder = {
  table: 'quick_guide',
  data: values,
};
