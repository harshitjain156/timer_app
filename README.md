# Timer App ⏰

A modern, customizable multi-timer app built with React Native and Expo. Supports multiple named timers, categories, progress visualization, history, dark/light themes, and local notifications. Designed for productivity, workouts, study sessions, and more.

---

## 🚀 Features

- **Multiple Timers:** Create timers with custom names, durations, and categories.
- **Category Grouping:** Timers are grouped by category with expandable/collapsible sections.
- **Timer Management:** Start, pause, reset, and delete individual timers. Bulk actions for all timers in a category.
- **Progress Visualization:** See progress bars and percentages for each timer.
- **Timer History:** View completed timer sessions with name, category, and completion time. Export history as JSON.
- **Customizable Categories:** Add/delete categories. Only non-empty categories are shown.
- **Theme Support:** Toggle between light and dark themes.
- **Custom Alerts:** Enable halfway and completion alerts for each timer. Get local notifications, even in the background.
- **Persistence:** All timers, categories, and history are saved using AsyncStorage.
- **Cross-Platform:** Works on Android and iOS. Tested for compatibility.

---

## 📱 Screenshots

> _Add screenshots here_

---

## 📦 Download APK

[![Download APK](https://img.shields.io/badge/Download-APK-blue?logo=android)](./app_apk/timer_app.apk)

> Place your built APK in the `app_apk` folder as `timer_app.apk` for this button to work.

---

## 🛠️ Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/docs)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- TypeScript

---

## 📂 Folder Structure

```
timer_app/
├── app/                # App screens (file-based routing)
├── components/         # Reusable UI components
│   └── timer_list/     # TimerList and subcomponents
├── assets/             # Fonts and images
├── app_apk/            # (Place your APK here)
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript config
└── ...
```

---

## 🏁 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app (development)

```bash
npx expo start
```

- Open in Expo Go, Android emulator, or iOS simulator.

### 3. Build APK (Android)

```bash
npx expo run:android --variant release
```

- The APK will be generated in the `android/app/build/outputs/apk/release/` directory. Move it to `app_apk/timer_app.apk` for sharing.

---

## 🤝 Contributing

1. Fork this repo and clone your fork.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request describing your changes.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Credits

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [All open source contributors]

---

> _Developed with ❤️ by [Your Name]_
