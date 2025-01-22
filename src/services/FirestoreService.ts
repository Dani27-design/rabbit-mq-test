import admin from "firebase-admin";
import { Order } from "../types";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIG_APIKEY,
  authDomain: process.env.FIREBASE_CONFIG_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_CONFIG_DATABASEURL,
  projectId: process.env.FIREBASE_CONFIG_PROJECTID,
  storageBucket: process.env.FIREBASE_CONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_CONFIG_APPID,
  measurementId: process.env.FIREBASE_CONFIG_MEASUREMENTID,
};

const credentialAdmin: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_CONFIG_PROJECTID,
  clientEmail: process.env.FIREBASE_CONFIG_CLIENTEMAIL,
  privateKey: process.env.FIREBASE_CONFIG_PRIVATEKEY,
};

admin.initializeApp({
  credential: admin.credential.cert(credentialAdmin),
  databaseURL: firebaseConfig.databaseURL,
  storageBucket: process.env.FIREBASE_CONFIG_STORAGEBUCKET,
});

const db = admin.firestore();

export class FirestoreService {
  private ordersCollection = db.collection("orders");

  async saveOrder(order: Order): Promise<void> {
    try {
    //   await this.ordersCollection.doc(order.ordersn).set(order);
      console.log(`Order ${order.ordersn} saved successfully.`);
    } catch (error) {
      console.error(`Error saving order ${order.ordersn}:`, error);
      throw error;
    }
  }

  async getOrder(ordersn: string): Promise<Order | null> {
    try {
      const doc = await this.ordersCollection.doc(ordersn).get();
      if (doc.exists) {
        return doc.data() as Order;
      } else {
        console.log(`Order ${ordersn} not found.`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting order ${ordersn}:`, error);
      throw error;
    }
  }

  async saveOrderError(
    ordersn: string,
    state: string,
    error: Error
  ): Promise<void> {
    try {
    //   await this.ordersCollection.doc(ordersn).update({
    //     errorState: state,
    //     errorMessage: error.message,
    //     errorStack: error.stack,
    //   });
      console.log(`Error for order ${ordersn} saved successfully.`);
    } catch (error) {
      console.error(`Error saving error for order ${ordersn}:`, error);
      throw error;
    }
  }
}
