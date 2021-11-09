import { initializeApp } from "firebase/app"
import { getFirestore, doc, addDoc, getDoc, collection, setDoc, onSnapshot, updateDoc } from "firebase/firestore"

const firebase = initializeApp({
  apiKey: "AIzaSyC_FVkpAVagU5L0vUoseOzoIIYkTBGQdjs",
  authDomain: "invoice-app-5b165.firebaseapp.com",
  projectId: "invoice-app-5b165",
  storageBucket: "invoice-app-5b165.appspot.com",
  messagingSenderId: "729573882905",
  appId: "1:729573882905:web:ef7d614d8b66f0655d3e88",
  measurementId: "G-LW3H3BN9EC",
})

export const firestore = getFirestore(firebase)

// export async function getUserData(uuid: string) {
//   const docRef = doc(db, "users", uuid)
//   const docSnap = await getDoc(docRef)

//   if (docSnap.exists()) {
//     const data = await getUserSettings(uuid)
//     return data
//   } else {
//     const usersRef = collection(db, "users")
//     const settingsRef = collection(db, "settings")

//     await setDoc(doc(usersRef, uuid), {
//       uuid,
//     })
//     await setDoc(doc(settingsRef, uuid), {
//       invoiceTitle: "Hello world",
//     })
//     const data = await getUserSettings(uuid)
//     return data
//   }
// }

// export async function getUserSettings(uuid: string) {
//   const docRef = doc(db, "settings", uuid)
//   const docSnap = await getDoc(docRef)
//   const data = docSnap.data()
//   return data
// }

// const defaultInvoiceData = {
//   invoiceTitle: "INVOICE",
//   no: { name: "Serial No.", value: "AA.00002" },
//   date: { name: "Invoice date:", value: "2020-04-30" },
//   seller: {
//     name: "Seller",
//     value: `Tony Stark\nAvengers Mansion\n890 Fifth Avenue\nManhattan New York 10004`,
//   },
//   buyer: {
//     name: "Buyer",
//     value: `Tony Stark\nAvengers Mansion\n890 Fifth Avenue\nManhattan New York 10004`,
//   },
//   table: {
//     headerNames: {
//       service: "Service",
//       units: "Units",
//       amount: "Amount",
//       price: "Price",
//       total: "Total",
//     },
//     sampleRow: {
//       service: "Service",
//       units: "days",
//       amount: "5.00",
//       price: "100",
//     },
//   },
//   notes: "Notes",
// }

// const defaultInvoiceItem = {
//   id: "123",
//   service: "Web Development",
//   units: "days",
//   amount: "8.00",
//   price: "100.00",
// }

// export function subscribeOnDataChange({ fingerprint, callback }) {
//   let unsubscribe = () => {}
//   if (!fingerprint) return unsubscribe
//   const docRef = doc(db, "data", fingerprint)
//   getDoc(docRef).then((docSnap) => {
//     if (!docSnap.exists()) {
//       const settingsRef = collection(db, "data")
//       setDoc(doc(settingsRef, fingerprint), {
//         ...defaultInvoiceData,
//         defaultInvoiceItem,
//       })
//     }
//   })

//   unsubscribe = onSnapshot(doc(db, "data", fingerprint), (doc) => {
//     callback(doc.data())
//   })
// }

// // export function addInvoiceItem(item,fingerprint) {
// //     if (Object.values(item).some((val) => !val)) return
// //     const docRef = doc(db, "invoiceItems", fingerprint)
// //      updateDoc(docRef, {
// //         capital: true
// //       });
// // }

// // export function updateInvoiceItem(item,fingerprint) {
// //     if (Object.values(item).some((val) => !val)) return
// //     const docRef = doc(db, "invoiceItems", fingerprint)
// //      updateDoc(docRef, {
// //         capital: true
// //       });
// // }

// export function addInvoiceItem(items, item, fingerprint) {
//   if (Object.values(item).some((val) => !val)) return
//   const docRef = doc(db, "data", fingerprint)
//   updateDoc(docRef, {
//     invoiceItems: [...items, { ...item }],
//   })
//   // const price = (+item.price).toFixed(2)
//   // const amount = (+item.amount).toFixed(2)
//   // const newItem = { ...item, price, amount, id: nanoid(), total: getTotal({ price, amount }) }
//   // state.defaultInvoiceItem = newItem
//   // state.invoiceItems = [...state.invoiceItems, newItem]
// }
