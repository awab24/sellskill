import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Load the service account JSON file asynchronously
const serviceAccount = JSON.parse(
  await readFile(new URL("./sell-skill-79ed7-firebase-adminsdk-gjrdu-8434066f5a.json", import.meta.url))
);

admin.initializeApp({    
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (deviceToken, title, body) => {

  console.log('******************************************deviceToken from sendNotification*************************************** ===================-=-=-=-=-=-=-=-=-=-=-> >  > > > >  ', deviceToken)
  const message = {
    notification: { title, body },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export { sendNotification };
