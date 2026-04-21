[![Discord](https://img.shields.io/discord/1308812521456799765?logo=discord&style=flat-square)](https://discord.gg/qhaMc2qCYB)
[![Matrix](https://img.shields.io/badge/Matrix-000?logo=matrix&logoColor=fff)](https://matrix.to/#/#nobodywho:matrix.org)
[![Mastodon](https://img.shields.io/badge/Mastodon-6364FF?logo=mastodon&logoColor=fff&style=flat-square)](https://mastodon.gamedev.place/@nobodywho)
[![Docs](https://img.shields.io/badge/Docs-lightblue?style=flat-square)](https://docs.nobodywho.ooo)

# NobodyWho Electron Starter App

This starter app demonstrates the capabilities of **[NobodyWho](https://github.com/nobodywho-ooo/nobodywho)**, a library designed to run LLMs locally and efficiently on any device.

## Getting Started

First, you will need to run `npm install`

Once that is done, run one of the following:

```sh
# Android
npm run android

# iOS
npm run iOS
```

**Note:** For iOS, if you have issues with metro, run `npm start` and then run the project on Xcode.

iOS cleanup

```sh
cd ios && rm ios/Podfile.lock && rm -rf ios/Pods && pod install && cd ..
```

Then clean the Xcode build cache and run:

```sh
npm start --reset-cache
```

Watchman cleanup

```sh
watchman watch-del-all && watchman shutdown-server
```

---

## Feedback & Contributions

We welcome your feedback and ideas!

- **Bug Reports & Improvements**: Open an issue on the **[Issues](https://github.com/nobodywho-ooo/electron-starter-example/issues)** page.
- **Feature Requests & Questions**: Join the discussion on **[Discussions](https://github.com/nobodywho-ooo/electron-starter-example/discussions)**.

```

```
