[![Discord](https://img.shields.io/discord/1308812521456799765?logo=discord&style=flat-square)](https://discord.gg/qhaMc2qCYB)
[![Matrix](https://img.shields.io/badge/Matrix-000?logo=matrix&logoColor=fff)](https://matrix.to/#/#nobodywho:matrix.org)
[![Mastodon](https://img.shields.io/badge/Mastodon-6364FF?logo=mastodon&logoColor=fff&style=flat-square)](https://mastodon.gamedev.place/@nobodywho)
[![Docs](https://img.shields.io/badge/Docs-lightblue?style=flat-square)](https://docs.nobodywho.ooo)

# NobodyWho React Native Starter App

This starter app demonstrates the capabilities of **[NobodyWho](https://github.com/nobodywho-ooo/nobodywho)**, a library designed to run LLMs locally and efficiently on any device.

## Features

- **Chat** — stream responses from a local LLM
- **Tool calling** — give the model access to custom functions (e.g. weather, calculator)
- **Vision & Hearing** — image & audio ingestion with a multimodal model
- **Embeddings & RAG** — semantic search with an embedding model and cross-encoder reranker

## 1. Getting Started

First, you will need to run `npm install` to install dependencies.

### 2. Download Models

#### Automated (Recommended)

**Chat only** (minimal setup):

| Platform      | Command                       |
| ------------- | ----------------------------- |
| macOS / Linux | `./scripts/download_chat.sh`  |
| Windows       | `.\scripts\download_chat.ps1` |

**All features** (chat + vision + hearing + embeddings + reranker):

| Platform      | Command                                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| macOS / Linux | `./scripts/download_chat_multimodal.sh && ./scripts/download_embedding_rerank.sh` |
| Windows       | `.\scripts\download_chat_multimodal.ps1; .\scripts\download_embedding_rerank.ps1` |

The scripts download models from Hugging Face, rename them, and place them in the `assets/` folder.

#### Manual Download

You can use any `.gguf` model from Hugging Face. Keep in mind:

- **Tool calling**: the chat model must support function/tool calling.
- **Vision & Hearing**: the chat and projection model must be compatible with each other.

### 3. Run the App

```sh
# Android
npm run android

# iOS
npm run iOS
```

**Note:** For iOS, if you have issues with metro, run `npm start` and then run the project on Xcode.

#### Miscellaneous

iOS cleanup

```sh
cd ios && rm ios/Podfile.lock && rm -rf ios/Pods && pod install && cd ..
```

Watchman cleanup

```sh
watchman watch-del-all && watchman shutdown-server
```

---

## Feedback & Contributions

We welcome your feedback and ideas!

- **Bug Reports & Improvements**: Open an issue on the **[Issues](https://github.com/nobodywho-ooo/react-native-starter-example/issues)** page.
- **Feature Requests & Questions**: Join the discussion on **[Discussions](https://github.com/nobodywho-ooo/react-native-starter-example/discussions)**.
