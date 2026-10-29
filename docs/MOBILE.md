# Android and iOS apps

Both apps are thin native shells that open your deployed website, so:

- Website updates reach the apps automatically. You never rebuild them for new features.
- The apps need an internet connection.
- Rebuild only when you change the app name, icon, package ID or website address.

Deploy the website first, and note its URL (for example `https://greenmeadows.vercel.app`).

## Android (APK and AAB)

The Android app is a [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity) built with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap). It runs your site full-screen in Chrome, without the address bar.

You need Node.js. On the first run, Bubblewrap offers to download a JDK and the Android SDK for you.

```bash
npm i -g @bubblewrap/cli
mkdir android && cd android
bubblewrap init --manifest https://greenmeadows.vercel.app/manifest.webmanifest
```

When Bubblewrap asks:

- **Application ID:** a reverse domain that you own, or for example `app.vercel.greenmeadows`.
- **Signing key:** let it create one. The template's `.gitignore` excludes `android/` and `*.keystore` so the key never reaches GitHub. **Back up the keystore file and its passwords.** You need them for every future update, and a lost key means you must publish a new app.

Then build it:

```bash
bubblewrap build
```

This produces `app-release-signed.apk`, which you can share and install directly, and `app-release-bundle.aab`, which you upload to the Google Play Store.

### Hide the address bar

Android shows a browser bar until your site proves that it owns the app. Run the following command, and copy the SHA-256 fingerprint it prints:

```bash
bubblewrap fingerprint list
```

Create `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.vercel.greenmeadows",
      "sha256_cert_fingerprints": ["AA:BB:…:FF"]
    }
  }
]
```

Deploy, and then open the app again. If you publish on Google Play with Play App Signing, add Play's fingerprint as well. You find it in Play Console under **Setup → App signing**.

## iOS (IPA)

The iOS app is a [Capacitor](https://capacitorjs.com) shell in `ios-app/`. A GitHub Actions workflow builds it on a macOS runner, so you don't need a Mac.

1. In `ios-app/capacitor.config.json`, set `server.url` to your site and `appId` to your own reverse-domain ID. You can also change `appName`.
2. Replace `ios-app/assets/AppIcon-1024.png` with your icon. It must be a 1024×1024 PNG with no transparency.
3. Push to GitHub, and then do one of the following:
   - Publish a GitHub release. The workflow attaches `OurSociety-unsigned.ipa` to the release.
   - Run **Actions → iOS build → Run workflow**, and download the artifact.

The IPA is **unsigned**. Apple allows only signed apps on iPhones, so to install it, choose one of these options:

- **Personal use or testing:** sign and install with [Sideloadly](https://sideloadly.io) or [AltStore](https://altstore.io) using a free Apple ID. With a free ID, the app expires after 7 days.
- **Everyone in the society:** join the Apple Developer Program (99 USD per year), and distribute through TestFlight or the App Store.

Residents can also skip the app. In Safari, they open the site and choose **Share → Add to Home Screen**. It then works like an app.
