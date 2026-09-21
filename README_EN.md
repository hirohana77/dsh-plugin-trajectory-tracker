# DSH Trajectory Tracker ⏱️

> **Know exactly what’s taking up your waiting time.**

[![npm version](https://img.shields.io/npm/v/dsh-plugin-trajectory-tracker.svg?color=38bdf8)](https://www.npmjs.com/package/dsh-plugin-trajectory-tracker)
[![npm downloads](https://img.shields.io/npm/dt/dsh-plugin-trajectory-tracker.svg?color=10b981)](https://www.npmjs.com/package/dsh-plugin-trajectory-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/hirohana77/dsh-plugin-trajectory-tracker/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hirohana77/dsh-plugin-trajectory-tracker.svg?style=social)](https://github.com/hirohana77/dsh-plugin-trajectory-tracker)

**English** | [简体中文](./README.md)

A lightweight, non-intrusive execution trajectory and real-time latency tracker plugin for **DeepSeek Harness (DSH)** WebUI. It provides instant, transparent visibility into the model's preparation, streaming, and tool execution stages as they happen.

---

## 🚀 Quick Start

### 1. Install Plugin
Install into your DSH Web Profile directory:
```bash
cd ~/.dsh/profiles/web
npm install dsh-plugin-trajectory-tracker
```

### 2. Enable in Profile
Ensure `~/.dsh/profiles/web/package.json` includes:
```json
{
  "dependencies": {
    "dsh-plugin-trajectory-tracker": "^1.0.1"
  },
  "dsh": {
    "bundle": {
      "plugins": [
        "dsh-plugin-trajectory-tracker"
      ]
    }
  }
}
```

### 3. Start DSH
```bash
dsh web
```
Refresh your browser (`http://127.0.0.1:3080`) to activate!

---

## 🌟 Key Features

- **Dual-Phase Reasoning Breakdown**: Accurately splits each model invocation into two distinct stages: **Time-to-First-Token (`首包等待`, TTFT / inference readiness)** and **Streaming Generation (`生成中`, thought & content streaming)**.
- **Dual Reactive Timers**: Real-time status indicator dynamically tracks both `(current_step_elapsed / total_turn_elapsed)` (e.g. `第 2 次调用 · 生成中 (3.8s / 9.7s)`), updating smoothly at 150ms intervals.
- **Zero-Space-Occupation Floating Panel**: Built with React Portals directly anchored on `document.body`—smoothly floats above the trigger without pushing or shifting any chat transcript content.
- **Top-Anchored Action Highlight Card**: Hovering over any tool row triggers an elegant, top-anchored white card in just 120ms, showing key actions (target file or command) at a glance without cluttering parameters or causing horizontal scrollbars.
- **Parallel Tools Auto-Grouping**: Accurately groups concurrent tool calls initiated in the same decision step without inserting duplicate model calls.
- **Natural Auto-Scroll to Latest**: Smoothly auto-scrolls to the bottom of the list when steps exceed container height, keeping the active step in view.
- **Crash-Proof Sandbox**: Isolated with React Error Boundaries; zero modifications to official core packages, 100% immune to white-screen errors.

---

## 🖼️ Screenshots

### 1. Live Execution & Floating Trajectory Panel
> Real-time dual reactive timers `(3.8s / 9.7s)`, live progress list, and top-anchored action highlight card on hover:
![Live Execution](assets/preview-live.png)

### 2. Post-Completion Turn Trajectory Recall
> Click the completed turn's `用时 13秒` pill to recall the full two-phase breakdown and exact step durations:
![Completed Turn Trajectory](assets/preview-completed.png)

---

## 📄 License

MIT License © 2026 [hirohana77](https://github.com/hirohana77)
