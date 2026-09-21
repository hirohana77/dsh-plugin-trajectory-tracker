window.__ModuleLoader__.load({
	id: "dsh-plugin-trajectory-tracker",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		const react_jsx_runtime = require("react/jsx-runtime");
		const react = require("react");
		const react_dom = require("react-dom");

		const CSS_ID = "dsh-plugin-trajectory-tracker/ui.css";
		const CSS = [
			".EvIC1a_turnStatus{height:calc(26px + var(--dsh-content-font-delta,0px));font:var(--dsw-font-s-strong-14);font-size:var(--dsh-content-font-size,14px);line-height:calc(22px + var(--dsh-content-font-delta,0px));white-space:nowrap;background:linear-gradient(90deg, var(--dsw-static-deepseek-500) 0%, var(--dsw-static-deepseek-500) 40%, var(--dsw-static-deepseek-200) 50%, var(--dsw-static-deepseek-500) 60%, var(--dsw-static-deepseek-500) 100%);color:#0000;-webkit-text-fill-color:transparent;background-position:100% 0;background-size:250% 100%;-webkit-background-clip:text;background-clip:text;flex:none;align-self:flex-start;align-items:center;animation:1.8s linear infinite EvIC1a_dsh-turn-status-shimmer;display:inline-flex}",
			".EvIC1a_turnStatusClock{font:var(--dsw-font-xs-13);font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-caption);-webkit-text-fill-color:var(--dsw-alias-label-caption);margin-left:8px;font-weight:400}",
			"@keyframes EvIC1a_dsh-turn-status-shimmer{to{background-position:0 0}}",
			"@media (prefers-reduced-motion:reduce){.EvIC1a_turnStatus{background-position:0 0;background-size:100% 100%;animation:none}}",
			".EvIC1a_turnStatus[data-dsh-tt-status]{cursor:pointer;user-select:none}",
			".dsh-tt-panel{z-index:1100;box-sizing:border-box;background:var(--dsw-specific-menu);width:max-content;min-width:min(300px,100vw - 24px);max-width:min(440px,100vw - 24px);box-shadow:var(--dsw-elevation-prominent);color:var(--dsw-alias-label-secondary);cursor:default;border:0;border-radius:12px;padding:16px;font-size:12px;line-height:18px;position:fixed;pointer-events:auto}",
			".dsh-tt-title{color:var(--dsw-alias-label-primary);justify-content:space-between;gap:16px;margin-bottom:8px;font-weight:500;display:flex}",
			".dsh-tt-titleValue{font-variant-numeric:tabular-nums}",
			".dsh-tt-rule{border-top:.5px solid var(--dsw-alias-border-l2);margin-bottom:10px}",
			".dsh-tt-details{color:var(--dsw-alias-label-tertiary);grid-template-columns:minmax(76px,auto) minmax(0,1fr);gap:6px 16px;margin:0 0 10px;display:grid}",
			".dsh-tt-details dt{margin:0}",
			".dsh-tt-details dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}",
			".dsh-tt-section{font-size:11px;font-weight:600;color:var(--dsw-alias-label-tertiary);margin-bottom:6px}",
			".dsh-tt-rows{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;overflow-x:hidden;min-width:240px}",
			".dsh-tt-row{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);border-radius:4px;padding:2px 6px;margin:0 -6px;cursor:default;transition:background .15s}",
			".dsh-tt-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}",
			".dsh-tt-row[data-active=true]{color:var(--dsw-static-deepseek-500,#38bdf8)}",
			".dsh-tt-dur{font-size:11px;color:var(--dsw-alias-label-caption);font-family:monospace;font-variant-numeric:tabular-nums;flex:none}"
		].join("");

		function ensureCss() {
			if (typeof document === "undefined") return;
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_ID) + "]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-trajectory-tracker";
			tag.dataset.pluginCss = CSS_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		function pad2(n) {
			return String(n).padStart(2, "0");
		}
		function formatRunDuration(ms) {
			const total = Math.max(0, Math.floor((ms ?? 0) / 1e3));
			const hours = Math.floor(total / 3600);
			const minutes = Math.floor(total / 60) % 60;
			const seconds = total % 60;
			if (hours > 0) return `${hours}小时${pad2(minutes)}分${pad2(seconds)}秒`;
			return minutes > 0 ? `${minutes}分${pad2(seconds)}秒` : `${seconds}秒`;
		}
		function formatStepDuration(ms) {
			if (ms == null) return "—";
			const totalSec = Math.max(0, ms / 1e3);
			if (totalSec < 60) return `${totalSec.toFixed(1)}s`;
			const minutes = Math.floor(totalSec / 60);
			const seconds = Math.floor(totalSec % 60);
			return `${minutes}分${pad2(seconds)}秒`;
		}

		function locationTurnOf(n) {
			const loc = n?.location;
			return loc?.kind === "turn" || loc?.kind === "step" ? loc.turn.turn : void 0;
		}
		function locationStartTime(n) {
			const loc = n?.location;
			if (loc?.kind === "step") return loc.step.start?.time ?? loc.turn.start?.time;
			if (loc?.kind === "turn") return loc.turn.start?.time;
		}
		function nodeStepOf(n) {
			if (n?.kind === "assistant-step" && typeof n.data?.step === "number") return n.data.step;
			if (n?.kind === "tool-call") {
				const root = n.data?.root;
				if (root && !("kind" in root) && typeof root.step === "number") return root.step;
				if (n.location?.kind === "step") return n.location.step.step;
			}
			return null;
		}
		function collectTraceNodes(keys, nodeStore, turnHint) {
			if (!nodeStore) return [];
			let turn = turnHint;
			if (turn === void 0) {
				for (const key of keys ?? []) {
					turn = locationTurnOf(typeof nodeStore.get === "function" ? nodeStore.get(key) : void 0);
					if (turn !== void 0) break;
				}
			}
			if (turn !== void 0 && typeof nodeStore.values === "function") {
				const all = [];
				for (const n of nodeStore.values()) {
					if ((n.kind === "assistant-step" || n.kind === "tool-call") && locationTurnOf(n) === turn) all.push(n);
				}
				if (all.length > 0) {
					all.sort((a, b) => (a.anchorSeq ?? 0) - (b.anchorSeq ?? 0) || String(a.key).localeCompare(String(b.key)));
					return all;
				}
			}
			const nodes = [];
			for (const key of keys ?? []) {
				const n = typeof nodeStore.get === "function" ? nodeStore.get(key) : void 0;
				if (n) nodes.push(n);
			}
			return nodes;
		}
		function assistantCallTiming(n, now) {
			const timing = n.data?.finalNode?.timing;
			const start = timing?.stepStartTime ?? locationStartTime(n);
			const firstToken = timing?.firstTokenTime ?? n.data?.firstTokenTime;
			const end = timing?.completedTime ?? (n.data?.status === "running" ? now : n.data?.finalNode?.time ?? n.data?.time);
			if (start == null || end == null) return null;
			return { start, firstToken, end, running: n.data?.status === "running" };
		}
		function extractToolHighlight(name, root) {
			if (!root) return null;
			let args = null;
			const raw = root.argsRaw ?? root.call?.argsRaw;
			if (typeof raw === "string") {
				try { args = JSON.parse(raw); } catch {}
			} else if (raw && typeof raw === "object") {
				args = raw;
			}
			if (args?.description && typeof args.description === "string") {
				return args.description;
			}
			if (name === "bash" && args?.command) {
				const firstLine = String(args.command).trim().split("\n")[0];
				return firstLine.length > 50 ? firstLine.slice(0, 48) + "..." : firstLine;
			}
			if ((name === "read" || name === "edit" || name === "write") && args?.file_path) {
				const p = String(args.file_path);
				const parts = p.split("/");
				return parts.length > 2 ? `.../${parts.slice(-2).join("/")}` : p;
			}
			if ((name === "grep" || name === "glob") && args?.pattern) {
				return `pattern: ${args.pattern}`;
			}
			if (name === "web_search" && (args?.query || args?.queries)) {
				return `query: ${args.query || (Array.isArray(args.queries) ? args.queries[0] : "")}`;
			}
			return null;
		}

		function toolCallInfo(n, now) {
			const root = n.data?.root;
			if (root == null) return null;
			const running = !("kind" in root);
			const name = (running ? root.name : root.call?.name) || root.name || "未知工具";
			const startMs = running ? typeof root.time === "number" ? root.time : null : root.callTime ?? null;
			let durationMs = null;
			if (running) {
				if (startMs != null) durationMs = Math.max(0, now - startMs);
			} else if (startMs != null && typeof root.time === "number") durationMs = Math.max(0, root.time - startMs);
			const highlight = extractToolHighlight(name, root);
			return { name, running, durationMs, startMs, step: nodeStepOf(n), highlight };
		}
		function clipInterval(start, end, bounds) {
			if (start == null || end == null) return null;
			const lo = bounds.start != null ? Math.max(start, bounds.start) : start;
			const hi = bounds.end != null ? Math.min(end, bounds.end) : end;
			return Math.max(0, hi - lo);
		}
		function turnTimeBounds(nodes, now) {
			for (const n of nodes) {
				const loc = n?.location;
				if (loc?.kind === "step" || loc?.kind === "turn") {
					const closed = loc.turn.status === "closed" && loc.turn.end?.time != null;
					return {
						start: loc.turn.start?.time,
						end: closed ? loc.turn.end.time : now
					};
				}
			}
			return {};
		}
		function reconcileTrajectoryDurations(items, runMs) {
			if (runMs == null || !Number.isFinite(runMs) || items.length === 0) return;
			if (items.some((item) => item.durationMs == null)) return;
			if (items.length === 1) {
				items[0].durationMs = Math.max(0, runMs);
				return;
			}
			const sum = items.reduce((acc, item) => acc + item.durationMs, 0);
			const last = items[items.length - 1];
			last.durationMs = Math.max(0, last.durationMs + (runMs - sum));
		}
		function keysAfterLastUser(order, nodeStore) {
			if (!order || !nodeStore || typeof nodeStore.get !== "function") return [];
			let lastUserIdx = -1;
			for (let i = order.length - 1; i >= 0; i--) {
				if (nodeStore.get(order[i])?.kind === "user") {
					lastUserIdx = i;
					break;
				}
			}
			return order.slice(lastUserIdx + 1);
		}
		function buildTurnTrajectory(keys, nodeStore, now, runMs, turnHint) {
			const items = [];
			let callIdx = 0;
			let lastCallStep = null;
			let activeToolName = null;
			let lastAssistant = null;
			let lastEnd = null;
			if (!nodeStore) return { items, callIdx, activeToolName, lastAssistant };
			const nodes = collectTraceNodes(keys, nodeStore, turnHint);
			const bounds = turnTimeBounds(nodes, now);
			if (bounds.start == null && typeof runMs === "number" && bounds.end != null) bounds.start = bounds.end - runMs;
			for (const n of nodes) {
				if (n.kind === "assistant-step") {
					callIdx++;
					lastCallStep = n.data?.step ?? callIdx;
					lastAssistant = n;
					activeToolName = null;
					const timing = assistantCallTiming(n, now);
					if (timing != null) {
						lastEnd = timing.end;
						const totalDur = clipInterval(timing.start, timing.end, bounds);
						// 实时检测首字是否已经开始吐出（思考流、正文流或工具定义）
						const blocks = n.data?.blocks ?? [];
						let hasTokens = false;
						for (const b of blocks) {
							if (b?.text && typeof b.text === "string" && b.text.length > 0) hasTokens = true;
							if (b?.kind === "reasoning" && typeof b.text === "string" && b.text.length > 0) hasTokens = true;
							if (b?.kind === "tool-call") hasTokens = true;
						}

						if (timing.firstToken != null) {
							const ttft = clipInterval(timing.start, timing.firstToken, bounds);
							const gen = clipInterval(timing.firstToken, timing.end, bounds);
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 首包等待`,
								durationMs: ttft,
								running: false
							});
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 生成中`,
								durationMs: gen,
								running: timing.running
							});
						} else if (timing.running && hasTokens) {
							// 流式进行中且已经有 Token 吐出：立刻切入生成中！
							const estTtft = totalDur != null ? Math.min(totalDur, 1500) : 1000;
							const estGen = totalDur != null ? Math.max(0, totalDur - estTtft) : 0;
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 首包等待`,
								durationMs: estTtft,
								running: false
							});
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 生成中`,
								durationMs: estGen,
								running: true
							});
						} else if (timing.running) {
							// 流式进行中但首字尚未到达：处于首包等待
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 首包等待`,
								durationMs: totalDur,
								running: true
							});
						} else {
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 首包等待`,
								durationMs: totalDur != null ? Math.round(totalDur * 0.7) : null,
								running: false
							});
							items.push({
								kind: "call",
								text: `第 ${callIdx} 次调用 · 生成中`,
								durationMs: totalDur != null ? Math.max(0, totalDur - Math.round(totalDur * 0.7)) : null,
								running: false
							});
						}
					}
				} else if (n.kind === "tool-call") {
					const info = toolCallInfo(n, now);
					if (!info) continue;
					const toolStep = info.step;
					if (callIdx === 0 || toolStep !== null && lastCallStep !== null && toolStep !== lastCallStep) {
						callIdx++;
						lastCallStep = toolStep ?? callIdx;
						lastAssistant = null;
						const synthStart = lastEnd ?? bounds.start;
						items.push({
							kind: "call",
							text: `第 ${callIdx} 次调用`,
							durationMs: clipInterval(synthStart, info.startMs, bounds),
							running: false
						});
					}
					if (info.running) activeToolName = info.name;
					const toolEnd = info.startMs != null && info.durationMs != null ? info.startMs + info.durationMs : null;
					if (toolEnd != null) lastEnd = toolEnd;
					items.push({
						kind: "tool",
						text: `调用 ${info.name} 工具`,
						highlight: info.highlight,
						durationMs: clipInterval(info.startMs, toolEnd, bounds) ?? info.durationMs,
						running: info.running
					});
				}
			}

			// 如果轮次处于实时进行中（没有 runMs 且没有 closed 结束时间），且最后一项不是运行中
			if (runMs == null && bounds.end == null || bounds.end === now) {
				const lastItem = items[items.length - 1];
				if (lastItem && lastItem.running) {
					// 正在运行的工具或调用，耗时持续动态递增至当前 now
					const start = lastItem.startMs ?? lastEnd ?? bounds.start;
					if (start != null) lastItem.durationMs = Math.max(0, now - start);
				} else if (lastEnd != null && activeToolName == null) {
					// 上一个工具刚执行完毕，模型正在进行下一次调用等待首包中
					callIdx++;
					items.push({
						kind: "call",
						text: `第 ${callIdx} 次调用 · 首包等待`,
						durationMs: Math.max(0, now - lastEnd),
						running: true
					});
				}
			}

			reconcileTrajectoryDurations(items, runMs);
			return { items, callIdx, activeToolName, lastAssistant };
		}
		function liveStatusText(traj) {
			if (!traj) return "深度思考中";
			if (traj.activeToolName) return `调用 ${traj.activeToolName} 工具`;
			const call = Math.max(1, traj.callIdx);
			let phase = "首包等待";
			const n = traj.lastAssistant;
			if (n?.data?.status === "running") {
				const blocks = n.data.blocks ?? [];
				let hasText = false;
				let hasReasoning = false;
				for (const block of blocks) {
					if (block?.kind === "text" && typeof block.text === "string" && block.text.trim() !== "") hasText = true;
					if (block?.kind === "reasoning" && typeof block.text === "string" && block.text.trim() !== "") hasReasoning = true;
				}
				if (hasText || hasReasoning || n.data?.firstTokenTime != null) phase = "生成中";
			}
			return `第 ${call} 次调用 · ${phase}`;
		}
		function openTurnStart(timeline) {
			if (!timeline?.turns) return null;
			let latest = null;
			for (const turn of timeline.turns.values()) if (turn.status === "open") latest = turn.start?.time ?? null;
			return latest;
		}
		function timelineIsRunning(timeline) {
			if (!timeline?.turns) return false;
			for (const turn of timeline.turns.values()) if (turn.status === "open") return true;
			return false;
		}

		class ErrorBoundary extends react.Component {
			constructor(props) {
				super(props);
				this.state = { failed: false };
			}
			static getDerivedStateFromError() {
				return { failed: true };
			}
			componentDidCatch(error) {
				console.warn("[dsh-plugin-trajectory-tracker]", error);
			}
			render() {
				if (this.state.failed) return null;
				return this.props.children;
			}
		}

		function placePanel(anchor) {
			if (!anchor) return { visibility: "hidden", left: 0, bottom: 0 };
			const margin = 12;
			const gap = 8;
			const rect = anchor.getBoundingClientRect();
			return {
				left: Math.min(Math.max(margin, rect.left), window.innerWidth - margin - 300),
				bottom: Math.max(margin, window.innerHeight - rect.top + gap),
				top: "auto"
			};
		}

		function TrajectoryPanel({ title, totalLabel, items, highlightLast, anchorRef, panelRef, onClose }) {
			const [tooltip, setTooltip] = react.useState(null);
			const timerRef = react.useRef(null);
			const rowsRef = react.useRef(null);

			// 条目过多或产生新条目时，自动自然平滑滑动到最底部（最新最近的过程条目）
			react.useEffect(() => {
				const el = rowsRef.current;
				if (el) {
					el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
				}
			}, [items.length]);

			const showTooltip = (text) => {
				if (!text) return;
				if (timerRef.current) clearTimeout(timerRef.current);
				timerRef.current = setTimeout(() => {
					setTooltip(text);
				}, 120);
			};

			const hideTooltip = () => {
				if (timerRef.current) clearTimeout(timerRef.current);
				setTooltip(null);
			};

			react.useEffect(() => {
				return () => {
					if (timerRef.current) clearTimeout(timerRef.current);
				};
			}, []);

			react.useEffect(() => {
				const onKey = (event) => {
					if (event.key === "Escape") onClose();
				};
				const onPointer = (event) => {
					const target = event.target;
					if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
					onClose();
				};
				document.addEventListener("keydown", onKey);
				document.addEventListener("pointerdown", onPointer, true);
				return () => {
					document.removeEventListener("keydown", onKey);
					document.removeEventListener("pointerdown", onPointer, true);
				};
			}, [anchorRef, panelRef, onClose]);

			return react_dom.createPortal((0, react_jsx_runtime.jsxs)("div", {
				ref: panelRef,
				className: "dsh-tt-panel",
				role: "dialog",
				"aria-label": title,
				style: placePanel(anchorRef.current),
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-tt-title",
						children: [
							(0, react_jsx_runtime.jsx)("span", { children: title }),
							totalLabel ? (0, react_jsx_runtime.jsx)("span", { className: "dsh-tt-titleValue", children: totalLabel }) : null
						]
					}),
					(0, react_jsx_runtime.jsx)("div", { className: "dsh-tt-rule", "aria-hidden": true }),
					(0, react_jsx_runtime.jsx)("div", {
						ref: rowsRef,
						className: "dsh-tt-rows",
						children: items.map((item, idx) => (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-tt-row",
							"data-active": highlightLast && idx === items.length - 1 ? "true" : void 0,
							onMouseEnter: () => showTooltip(item.highlight),
							onMouseLeave: hideTooltip,
							children: [
								(0, react_jsx_runtime.jsx)("span", { children: item.text }),
								(0, react_jsx_runtime.jsx)("span", {
									className: "dsh-tt-dur",
									children: item.durationMs == null ? "—" : formatStepDuration(item.durationMs)
								})
							]
						}, `${item.kind}-${idx}`))
					}),
					tooltip && (0, react_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							left: "12px",
							right: "12px",
							bottom: "calc(100% + 8px)",
							background: "var(--dsw-specific-menu, #ffffff)",
							color: "var(--dsw-alias-label-primary, #0f172a)",
							border: "1px solid var(--dsw-alias-border-subtle, #cbd5e1)",
							borderRadius: "8px",
							padding: "6px 12px",
							fontSize: "11px",
							lineHeight: "16px",
							wordBreak: "break-word",
							whiteSpace: "normal",
							boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
							pointerEvents: "none",
							zIndex: 1400,
							animation: "dsh-tt-popin 0.12s ease-out"
						},
						children: tooltip
					})
				]
			}), document.body);
		}

		function useLiveTrajectory(useChat, startTime) {
			const snapshot = useChat((s) => s);
			const [elapsedMs, setElapsedMs] = react.useState(0);
			const running = timelineIsRunning(snapshot?.timeline);
			const order = snapshot?.order ?? [];
			const nodeStore = snapshot?.nodes ?? null;
			const turnStart = startTime ?? openTurnStart(snapshot?.timeline);
			react.useEffect(() => {
				const anchor = turnStart ?? Date.now();
				const tick = () => setElapsedMs(Math.max(0, Date.now() - anchor));
				tick();
				const id = setInterval(tick, 1e3);
				return () => clearInterval(id);
			}, [turnStart]);
			const traj = buildTurnTrajectory(keysAfterLastUser(order, nodeStore), nodeStore, Date.now(), elapsedMs);
			const items = traj.items.length > 0 ? traj.items : [{
				kind: "call",
				text: "第 1 次调用",
				durationMs: elapsedMs,
				running: true
			}];
			return {
				snapshot,
				running,
				nodeStore,
				elapsedMs,
				traj,
				items
			};
		}

		function LiveStatus({ startTime, useChat }) {
			ensureCss();
			const rootRef = react.useRef(null);
			const live = useLiveTrajectory(useChat, startTime);
			const showClock = true;
			const openLive = react.useCallback((event) => {
				event.preventDefault();
				window.dispatchEvent(new CustomEvent("dsh-tt-open", {
					detail: {
						mode: "live",
						anchor: rootRef.current
					}
				}));
			}, []);
			return (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: "EvIC1a_turnStatus",
				"data-dsh-tt-status": true,
				role: "status",
				"aria-live": "polite",
				"aria-haspopup": "dialog",
				title: "点击查看本轮执行轨迹",
				onClick: openLive,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") openLive(event);
				},
				tabIndex: 0,
				children: [
					liveStatusText(live.traj),
					showClock ? (0, react_jsx_runtime.jsx)("span", {
						className: "EvIC1a_turnStatusClock",
						"aria-hidden": true,
						children: (() => {
							const totalSec = (live.elapsedMs / 1000).toFixed(1);
							const lastItem = live.items?.[live.items.length - 1];
							const curMs = lastItem?.durationMs ?? live.elapsedMs;
							const curSec = (curMs / 1000).toFixed(1);
							return `(${curSec}s / ${totalSec}s)`;
						})()
					}) : null
				]
			});
		}

		function UsageHost({ useChat }) {
			ensureCss();
			const [open, setOpen] = react.useState(false);
			const [mode, setMode] = react.useState("live");
			const [completedTurn, setCompletedTurn] = react.useState(null);
			const [, setTick] = react.useState(0);
			const panelRef = react.useRef(null);
			const triggerRef = react.useRef(null);
			const snapshot = typeof useChat === "function" ? useChat((s) => s) : null;
			const nodeStore = snapshot?.nodes ?? null;

			// 当浮动弹窗展开且处于 live 运行模式时，高频定时刷新驱动组件 re-render，使时间持续递增
			react.useEffect(() => {
				if (!open || mode !== "live") return;
				const timer = setInterval(() => setTick((v) => v + 1), 150);
				return () => clearInterval(timer);
			}, [open, mode]);
			const close = react.useCallback(() => {
				setOpen(false);
				setCompletedTurn(null);
			}, []);
			react.useEffect(() => {
				const onOpen = (event) => {
					const detail = event.detail ?? {};
					triggerRef.current = detail.anchor ?? null;
					setMode(detail.mode === "completed" ? "completed" : "live");
					setCompletedTurn(typeof detail.turn === "number" ? detail.turn : null);
					setOpen(true);
				};
				const onClick = (event) => {
					const button = event.target instanceof Element ? event.target.closest("button[aria-haspopup=dialog]") : null;
					if (button == null) return;
					const host = button.closest("[data-turn-tail]");
					if (host == null) return;
					const label = `${button.textContent ?? ""} ${button.getAttribute("aria-label") ?? ""}`;
					if (!/用时|ran for/i.test(label)) return;
					event.preventDefault();
					event.stopPropagation();
					triggerRef.current = button;
					const turnNumber = Number(host.getAttribute("data-turn-tail"));
					setMode("completed");
					setCompletedTurn(Number.isFinite(turnNumber) ? turnNumber : 0);
					setOpen(true);
				};
				window.addEventListener("dsh-tt-open", onOpen);
				document.addEventListener("click", onClick, true);
				return () => {
					window.removeEventListener("dsh-tt-open", onOpen);
					document.removeEventListener("click", onClick, true);
				};
			}, []);

			// 方案 A：在原生位置自动更新正在生成中的状态文本，并绑定点击悬浮弹窗
			react.useEffect(() => {
				const updateNativeStatus = () => {
					const el = document.querySelector('[role="status"].EvIC1a_turnStatus, [role="status"][class*="turnStatus"]');
					if (!el) return;
					const order = snapshot?.order ?? [];
					const turnStart = openTurnStart(snapshot?.timeline);
					const elapsedMs = turnStart ? Math.max(0, Date.now() - turnStart) : 0;
					const live = buildTurnTrajectory(keysAfterLastUser(order, nodeStore), nodeStore, Date.now(), elapsedMs);
					const text = liveStatusText(live);
					const totalSec = (elapsedMs / 1000).toFixed(1);
					const lastItem = live.items?.[live.items.length - 1];
					const curMs = lastItem?.durationMs ?? elapsedMs;
					const curSec = (curMs / 1000).toFixed(1);

					el.textContent = `${text} (${curSec}s / ${totalSec}s)`;
					el.style.cursor = "pointer";
					el.title = "点击查看本轮执行轨迹";

					if (!el.dataset.ttBound) {
						el.dataset.ttBound = "true";
						el.addEventListener("click", (e) => {
							e.preventDefault();
							e.stopPropagation();
							window.dispatchEvent(new CustomEvent("dsh-tt-open", {
								detail: { mode: "live", anchor: el }
							}));
						});
					}
				};
				const timer = setInterval(updateNativeStatus, 150);
				return () => clearInterval(timer);
			}, [snapshot, nodeStore]);
			if (!open || nodeStore == null) return null;
			let title = "本轮执行轨迹";
			let totalLabel;
			let items = [];
			let highlightLast = true;
			if (mode === "completed" && completedTurn != null) {
				const keys = snapshot?.locations?.getTurn ? snapshot.locations.getTurn(completedTurn) : [];
				let runMs;
				for (const n of typeof nodeStore.values === "function" ? nodeStore.values() : []) {
					const loc = n?.location;
					if ((loc?.kind === "turn" || loc?.kind === "step") && loc.turn.turn === completedTurn && loc.turn.start?.time != null && loc.turn.end?.time != null) {
						runMs = Math.max(0, loc.turn.end.time - loc.turn.start.time);
						break;
					}
				}
				const done = buildTurnTrajectory(keys, nodeStore, Date.now(), runMs, completedTurn);
				title = "本轮用时和速度";
				totalLabel = runMs != null ? formatRunDuration(runMs) : void 0;
				items = done.items;
				highlightLast = false;
			} else {
				const order = snapshot?.order ?? [];
				const elapsedMs = Math.max(0, Date.now() - (openTurnStart(snapshot?.timeline) ?? Date.now()));
				const live = buildTurnTrajectory(keysAfterLastUser(order, nodeStore), nodeStore, Date.now(), elapsedMs);
				items = live.items.length > 0 ? live.items : [{
					kind: "call",
					text: "第 1 次调用",
					durationMs: elapsedMs,
					running: true
				}];
				totalLabel = `已耗时 ${formatRunDuration(elapsedMs)}`;
			}
			return (0, react_jsx_runtime.jsx)(TrajectoryPanel, {
				title,
				totalLabel,
				items,
				highlightLast,
				anchorRef: triggerRef,
				panelRef,
				onClose: close
			});
		}

		function LiveSafe(props) {
			if (typeof props.useChat !== "function") return null;
			return (0, react_jsx_runtime.jsx)(ErrorBoundary, {
				children: (0, react_jsx_runtime.jsx)(LiveStatus, {
					startTime: props.startTime,
					useChat: props.useChat
				})
			});
		}
		function UsageSafe(props) {
			if (typeof props.useChat !== "function") return null;
			return (0, react_jsx_runtime.jsx)(ErrorBoundary, {
				children: (0, react_jsx_runtime.jsx)(UsageHost, { useChat: props.useChat })
			});
		}

		const inject = ["slots"];
		function apply(ctx) {
			if (!ctx?.slots?.inject) {
				console.warn("[dsh-plugin-trajectory-tracker] slots service missing");
				return;
			}
			ctx.slots.inject("conversation.chat.turnStatus", () => ctx.slots.register({
				name: "conversation.chat.turnStatus"
			}, LiveSafe));
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "trajectory-usage",
				order: 5
			}, UsageSafe));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
