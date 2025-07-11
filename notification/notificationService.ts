import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function scheduleNotification(seconds: number, title: string, body: string) {
  if(seconds>500)return
  return await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, channelId: 'timer-alerts' },
  });
}

export async function cancelNotification(id: string) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}

export async function initializeNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  const status = await Notifications.getPermissionsAsync();
  if (!status.granted) await Notifications.requestPermissionsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('timer-alerts', {
      name: 'Timer Alerts',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
} 