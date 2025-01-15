import { ISeeder } from '../seed.interface';
import { Faq } from 'src/modules/faq/entities/faq.entity';
import { v4 as uuidv4 } from 'uuid';

const values: Faq[] = [
  {
    id: uuidv4(),
    question: 'How do I order from ShopNowNow?',
    answer:
      'Ordering your Groceries and Drinks on the Shopnownow app or website is as simple as ABC: Search; Pay; Receive. Simply search for the product you want to order, pay for it, and receive the order at your doorstep. The Shopnownow app is available on both the Google Play store and the IOS store. You can also order via our website @ www.shopnownow.app.',
  },
  {
    id: uuidv4(),
    question: 'Where do you deliver to?',
    answer:
      'Shopnownow currently makes deliveries only on the Island in Lagos (Ikoyi, V.I., Oniru, Lagos Island, Marina, and Lekki Phase1-Ajah). We hope to add other delivery locations soon.',
  },
  {
    id: uuidv4(),
    question: 'How do Loyalty Points work?',
    answer:
      'You automatically earn Loyalty points every time you pay for orders on the Shopnownow app/website. You can convert those points to cash anytime and use them to make purchases on the app/website.',
  },
  {
    id: uuidv4(),
    question: 'Does ShopNowNow offer Free Delivery?',
    answer:
      'Yes, Shopnownow offers free delivery for orders of 100,000 and above. The minimum order on the Shopnownow App or website is N25,000, and all orders less than N25,000 are charged a token fee for delivery based on location.',
  },
  {
    id: uuidv4(),
    question: 'How do I pay for my order?',
    answer:
      'Shopnownow does not offer payment on delivery. All payments for groceries/drinks ordered on the Shopnownow app/website are to be made online via debit or credit card, bank transfer (using our safe and secure Paystack payment gateway), or via the Shopnownow Wallet account on the app/website. Instead of always having to struggle with entering your debit card details, you can make and complete your orders on Shopnownow much quicker by simply funding your Shopnownow wallet (MyWallet) on the app/website and all your subsequent orders can be paid for using the MyWallet payment option.',
  },
  {
    id: uuidv4(),
    question: 'What items can I order on Shopnownow?',
    answer:
      'You can order all your Grocery items (including healthy organic food products), Alcoholic drinks, Meat, Fish, and Poultry (including snail, prawns, etc), and Home & Body Care products from the Shopnownow App and website. Simply click on the desired category in the app or website and type in the item name in the “Search” space provided to order.',
  },
  {
    id: uuidv4(),
    question: 'What days and times can I order?',
    answer:
      'You can make orders on the Shopnownow App or website any day and time from the convenience of your home or office. However, Shopnonow will only deliver your orders from 9 am to 8 pm Monday to Friday and 10 am to 8 pm on Saturdays. Shopnonow does not make deliveries on Sunday.',
  },
  {
    id: uuidv4(),
    question: 'Can I get discounts on bulk orders?',
    answer:
      'Yes, you can enjoy 5% discount on bulk orders of N250,000 and above.',
  },
  {
    id: uuidv4(),
    question: 'Do I get discounts during Off-peak periods?',
    answer:
      'Yes, you can always get 50% discount on Delivery Fees when you order during off peak periods of 9am-12noon, Monday to Friday, every week.',
  },
  {
    id: uuidv4(),
    question: "Can't find it on Shopnonow?",
    answer:
      'If you cannot find your desired item on the Shopnownow app or website, please click on the “Special Request” tab on the App or website and send us the name of the item(s) you wish to purchase, and we promise to add it to our inventory for future purchases.',
  },
  {
    id: uuidv4(),
    question: 'How do I use my Discount Coupons?',
    answer:
      'You can use your Discount or Cash coupon codes by entering the coupon code details in the space provided at the point of checkout before making payment online via your Shopnownow wallet or debit/credit card.',
  },
  {
    id: uuidv4(),
    question: "Can't find your question here?",
    answer:
      'If you cannot find your question among our FAQs, please send us an email (support@shopnownow.app) or send us a message on WhatsApp (+2347038989026) or click on the Live Chat button on our website to chat with one of our customer care representatives.',
  },
];

export const FaqSeed: ISeeder = {
  table: 'faq',
  data: values,
};
