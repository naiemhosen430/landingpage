"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Layers,
  Palette,
  Box,
  Type,
} from "lucide-react";

type Props = {
  initialHtml: string;
  initialCss?: string;
  onChange: (data: { html: string; css: string }) => void;
  isDark?: boolean;
};

export function VisualEditor({
  initialHtml,
  initialCss,
  onChange,
  isDark,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapeRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "blocks" | "layers" | "styles" | "traits"
  >("blocks");

  // Inject GrapesJS theme styles into document head (no external CSS file)
  useEffect(() => {
    const styleId = "lp-grapesjs-theme";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        [data-theme="light"] .gjs-editor {
          --gjs-bg: #ffffff;
          --gjs-surface: #f8fafc;
          --gjs-panel: #ffffff;
          --gjs-text: #0f172a;
          --gjs-text-secondary: #64748b;
          --gjs-border: #e2e8f0;
          --gjs-primary: #2563eb;
          --gjs-primary-text: #ffffff;
          --gjs-accent: #f1f5f9;
          --gjs-danger: #dc2626;
          --gjs-muted: #f1f5f9;
          --gjs-ring: rgba(37,99,235,0.25);
          --gjs-canvas-bg: #f1f5f9;
          --gjs-frame-bg: #ffffff;
        }
        [data-theme="dark"] .gjs-editor {
          --gjs-bg: #0b1120;
          --gjs-surface: #0f172a;
          --gjs-panel: #1e293b;
          --gjs-text: #f1f5f9;
          --gjs-text-secondary: #94a3b8;
          --gjs-border: #334155;
          --gjs-primary: #3b82f6;
          --gjs-primary-text: #ffffff;
          --gjs-accent: #1e293b;
          --gjs-danger: #ef4444;
          --gjs-muted: #1e293b;
          --gjs-ring: rgba(59,130,246,0.3);
          --gjs-canvas-bg: #0f172a;
          --gjs-frame-bg: #0f172a;
        }

        .gjs-editor { background: transparent !important; }
        .gjs-cv-canvas { background: var(--gjs-canvas-bg) !important; }
        .gjs-frame { background: var(--gjs-frame-bg) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
        .gjs-one-bg { background: var(--gjs-panel) !important; }
        .gjs-two-color { color: var(--gjs-text) !important; }
        .gjs-three-bg { background: var(--gjs-accent) !important; }
        .gjs-four-color, .gjs-four-color-h:hover { color: var(--gjs-primary) !important; }
        .gjs-field { background: var(--gjs-bg) !important; border: 1px solid var(--gjs-border) !important; border-radius: 6px; }
        .gjs-field input, .gjs-field select, .gjs-field textarea { background: transparent !important; color: var(--gjs-text) !important; }
        .gjs-btn-prim { background: var(--gjs-primary) !important; color: var(--gjs-primary-text) !important; border-radius: 6px; }
        .gjs-btn-prim:hover { opacity: 0.9; }
        .gjs-block { background: var(--gjs-muted) !important; border: 1px solid var(--gjs-border) !important; border-radius: 8px; box-shadow: none !important; color: var(--gjs-text) !important; transition: all 0.15s; }
        .gjs-block:hover { border-color: var(--gjs-primary) !important; background: var(--gjs-accent) !important; }
        .gjs-block-label { color: var(--gjs-text) !important; }
        .gjs-category-title, .gjs-layer-title, .gjs-sm-title, .gjs-clm-tags #gjs-clm-checkbox label, .gjs-clm-header-label { color: var(--gjs-text) !important; background: var(--gjs-muted) !important; border-bottom: 1px solid var(--gjs-border) !important; }
        .gjs-sm-sector, .gjs-layer-item, .gjs-block-category { border-bottom: 1px solid var(--gjs-border) !important; }
        .gjs-resizer-h { border-color: var(--gjs-border) !important; }
        .gjs-toolbar { background: var(--gjs-panel) !important; border: 1px solid var(--gjs-border) !important; border-radius: 6px; }
        .gjs-toolbar-item { color: var(--gjs-text) !important; border-radius: 4px; }
        .gjs-toolbar-item:hover { background: var(--gjs-accent) !important; }
        .gjs-badge { background: var(--gjs-primary) !important; color: var(--gjs-primary-text) !important; }
        .gjs-com-placeholder, .gjs-placeholder { background: rgba(37,99,235,0.15) !important; border: 1px dashed var(--gjs-primary) !important; }
        .gjs-highlighter { outline: 1px solid var(--gjs-primary) !important; }
        .gjs-color-warn { color: var(--gjs-danger) !important; }
        .gjs-mdl-dialog { background: var(--gjs-panel) !important; border: 1px solid var(--gjs-border) !important; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); }
        .gjs-mdl-header { border-bottom: 1px solid var(--gjs-border) !important; color: var(--gjs-text) !important; }
        .gjs-mdl-btn-close { color: var(--gjs-text-secondary) !important; }
        .gjs-mdl-btn-close:hover { color: var(--gjs-text) !important; }
        .gjs-am-file-uploader > form { background: var(--gjs-muted) !important; border: 2px dashed var(--gjs-border) !important; border-radius: 8px; color: var(--gjs-text-secondary) !important; }
        .gjs-am-assets-header { border-bottom: 1px solid var(--gjs-border) !important; }
        .gjs-am-assets-cont { background: transparent !important; }
        .gjs-am-asset { border: 1px solid var(--gjs-border) !important; border-radius: 6px; background: var(--gjs-muted) !important; }
        .gjs-am-preview, .gjs-am-preview-bg { background: var(--gjs-bg) !important; }
        .gjs-am-name { color: var(--gjs-text) !important; }
        .gjs-am-close { color: var(--gjs-danger) !important; }
        .gjs-am-close:hover { background: rgba(220,38,38,0.1) !important; }
        [data-theme="dark"] .gjs-am-close:hover { background: rgba(239,68,68,0.15) !important; }
        .gjs-pn-panel { background: var(--gjs-panel) !important; }
        .gjs-pn-btn { color: var(--gjs-text-secondary) !important; border-radius: 6px; }
        .gjs-pn-btn:hover, .gjs-pn-btn.gjs-pn-active { color: var(--gjs-text) !important; background: var(--gjs-accent) !important; }
        .gjs-pn-devices-c { border-bottom: 1px solid var(--gjs-border) !important; }
        .gjs-pn-options, .gjs-pn-views, .gjs-pn-commands { border-color: var(--gjs-border) !important; }
        .gjs-pn-panel#gjs-pn-commands, .gjs-pn-panel#gjs-pn-options { background: var(--gjs-panel) !important; }
        .gjs-pn-panel#gjs-pn-views-container { background: var(--gjs-panel) !important; border-left: 1px solid var(--gjs-border) !important; }
        .gjs-pn-panel#gjs-pn-views { background: var(--gjs-panel) !important; border-right: 1px solid var(--gjs-border) !important; }
        .gjs-pn-panel#gjs-pn-devices-c { background: var(--gjs-panel) !important; border-bottom: 1px solid var(--gjs-border) !important; }
        .gjs-pn-panel#gjs-pn-options .gjs-pn-btn { border: 1px solid var(--gjs-border) !important; }
        .gjs-title, #gjs-clm-status-c label { color: var(--gjs-text) !important; }
        .gjs-radio-item input:checked + .gjs-radio-item-label { background: var(--gjs-primary) !important; color: var(--gjs-primary-text) !important; }
        .gjs-radio-item-label { color: var(--gjs-text) !important; background: var(--gjs-muted) !important; border: 1px solid var(--gjs-border) !important; }
        .gjs-field-arrow-u, .gjs-field-arrow-d { border-color: var(--gjs-text-secondary) transparent !important; }
        .gjs-field-integer input, .gjs-field-number input, .gjs-field select { color: var(--gjs-text) !important; }
        .gjs-clm-header-status, .gjs-clm-tag-status { border-color: var(--gjs-border) !important; }
        .gjs-clm-tag-label { color: var(--gjs-text) !important; }
        .gjs-clm-tags #gjs-clm-new { color: var(--gjs-text) !important; }
        .gjs-clm-tags #gjs-clm-add-tag { background: var(--gjs-primary) !important; color: var(--gjs-primary-text) !important; }
        .gjs-clm-tags #gjs-clm-checkbox label { border: 1px solid var(--gjs-border) !important; }
        .gjs-input-holder input, .gjs-textarea { background: var(--gjs-bg) !important; color: var(--gjs-text) !important; border: 1px solid var(--gjs-border) !important; border-radius: 6px; }
        .gjs-input-holder input:focus, .gjs-textarea:focus { outline: none; border-color: var(--gjs-primary) !important; box-shadow: 0 0 0 3px var(--gjs-ring) !important; }
        .gjs-label { color: var(--gjs-text) !important; }
        .gjs-layer-name { color: var(--gjs-text) !important; }
        .gjs-layer-vis, .gjs-layer-move { color: var(--gjs-text-secondary) !important; }
        .gjs-layer-vis:hover, .gjs-layer-move:hover { color: var(--gjs-text) !important; }
        .gjs-layer-count { background: var(--gjs-primary) !important; color: var(--gjs-primary-text) !important; }
        .gjs-no-app { background: var(--gjs-panel) !important; color: var(--gjs-text-secondary) !important; }
        .gjs-selected { outline: 2px solid var(--gjs-primary) !important; }
        .gjs-hovered { outline: 1px dashed rgba(37,99,235,0.5) !important; }
        [data-theme="dark"] .gjs-hovered { outline: 1px dashed rgba(59,130,246,0.5) !important; }
        .gjs-editor-cont ::-webkit-scrollbar { width: 6px; height: 6px; }
        .gjs-editor-cont ::-webkit-scrollbar-track { background: transparent; }
        .gjs-editor-cont ::-webkit-scrollbar-thumb { background: var(--gjs-border); border-radius: 3px; }
        .gjs-editor-cont ::-webkit-scrollbar-thumb:hover { background: var(--gjs-text-secondary); }
        .gjs-dark .gjs-one-bg { background: var(--gjs-panel) !important; }
        .gjs-dark .gjs-two-color { color: var(--gjs-text) !important; }
        .gjs-dark .gjs-three-bg { background: var(--gjs-muted) !important; }
        .gjs-dark .gjs-field { background: var(--gjs-bg) !important; border-color: var(--gjs-border) !important; }
        .gjs-dark .gjs-block { background: var(--gjs-muted) !important; border-color: var(--gjs-border) !important; }
        .gjs-dark .gjs-block:hover { background: var(--gjs-accent) !important; border-color: var(--gjs-primary) !important; }
        .gjs-dark .gjs-mdl-dialog { background: var(--gjs-panel) !important; border-color: var(--gjs-border) !important; }
        .gjs-dark .gjs-frame { background: var(--gjs-frame-bg) !important; }
        .gjs-dark .gjs-cv-canvas { background: var(--gjs-canvas-bg) !important; }
      `;
      document.head.appendChild(style);
    }
    return () => {};
  }, []);

  // Init GrapesJS
  useEffect(() => {
    let editor: any;
    let destroyed = false;

    const init = async () => {
      const grapesjs = await import("grapesjs");
      if (destroyed) return;

      const htmlContent = initialHtml || "<div></div>";
      const cssContent = initialCss || "";

      editor = grapesjs.default.init({
        container: editorRef.current!,
        fromElement: false,
        components: htmlContent,
        style: cssContent,
        height: "100%",
        width: "auto",
        storageManager: false,
        assetManager: { embedAsBase64: true },
        deviceManager: {
          devices: [
            { name: "Desktop", width: "" },
            { name: "Tablet", width: "768px", widthMedia: "768px" },
            { name: "Mobile", width: "375px", widthMedia: "375px" },
          ],
        },
        panels: { defaults: [] },
        blockManager: {
          appendTo: "#gjs-blocks",
          blocks: [
            {
              id: "section",
              label: "Section",
              category: "Basic",
              content: `<section style="padding:32px;text-align:center"><h2 style="font-size:24px;font-weight:700;margin-bottom:16px">Section Title</h2><p style="color:#64748b">Add your content here.</p></section>`,
            },
            {
              id: "text",
              label: "Text",
              category: "Basic",
              content: `<p style="line-height:1.6">Insert your text here</p>`,
            },
            {
              id: "image",
              label: "Image",
              category: "Basic",
              content: { type: "image" },
            },
            {
              id: "button",
              label: "Button",
              category: "Basic",
              content: `<button style="padding:8px 16px;background:#2563eb;color:#fff;border-radius:6px;border:none;cursor:pointer">Click me</button>`,
            },
            {
              id: "grid-2",
              label: "2 Columns",
              category: "Layout",
              content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px"><div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px">Column 1</div><div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px">Column 2</div></div>`,
            },
            {
              id: "grid-3",
              label: "3 Columns",
              category: "Layout",
              content: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:16px"><div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px">Col 1</div><div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px">Col 2</div><div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px">Col 3</div></div>`,
            },
            {
              id: "hero",
              label: "Hero",
              category: "Sections",
              content: `<div style="padding:80px 24px;text-align:center;background:#f8fafc"><h1 style="font-size:36px;font-weight:700;margin-bottom:16px">Hero Headline</h1><p style="font-size:18px;color:#64748b;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto">Subheadline text goes here to support the main message.</p><button style="padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;border:none;font-weight:500;cursor:pointer">Get Started</button></div>`,
            },
            {
              id: "features",
              label: "Features",
              category: "Sections",
              content: `<div style="padding:64px 24px"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;max-width:900px;margin:0 auto"><div style="text-align:center"><div style="width:48px;height:48px;border-radius:8px;background:rgba(37,99,235,0.1);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;color:#2563eb">★</div><h3 style="font-weight:600;margin-bottom:8px">Feature One</h3><p style="font-size:14px;color:#64748b">Description of your first feature.</p></div><div style="text-align:center"><div style="width:48px;height:48px;border-radius:8px;background:rgba(37,99,235,0.1);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;color:#2563eb">●</div><h3 style="font-weight:600;margin-bottom:8px">Feature Two</h3><p style="font-size:14px;color:#64748b">Description of your second feature.</p></div><div style="text-align:center"><div style="width:48px;height:48px;border-radius:8px;background:rgba(37,99,235,0.1);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;color:#2563eb">✓</div><h3 style="font-weight:600;margin-bottom:8px">Feature Three</h3><p style="font-size:14px;color:#64748b">Description of your third feature.</p></div></div></div>`,
            },
          ],
        },
      });

      grapeRef.current = editor;

      const updateCanvasTheme = () => {
        const frame = editor.Canvas.getFrameEl();
        if (!frame) return;
        const body = frame.contentDocument?.body;
        if (!body) return;
        if (isDark) {
          body.style.backgroundColor = "#0f172a";
          body.style.color = "#f8fafc";
        } else {
          body.style.backgroundColor = "#ffffff";
          body.style.color = "#0f172a";
        }
      };

      editor.on("load", () => {
        setLoading(false);
        updateCanvasTheme();
      });

      const emitChange = () => {
        const html = editor.getHtml();
        const css = editor.getCss();
        onChange({ html, css });
      };

      editor.on("component:update", emitChange);
      editor.on("style:update", emitChange);

      const panels = editor.Panels;
      panels.addPanel({
        id: "devices",
        visible: true,
        buttons: [
          {
            id: "device-desktop",
            className: "fa fa-desktop",
            command: "set-device-desktop",
            active: true,
          },
          {
            id: "device-tablet",
            className: "fa fa-tablet",
            command: "set-device-tablet",
          },
          {
            id: "device-mobile",
            className: "fa fa-mobile",
            command: "set-device-mobile",
          },
        ],
      });

      const el = editorRef.current;
      if (el) {
        if (isDark) el.classList.add("gjs-dark");
        else el.classList.remove("gjs-dark");
      }
      updateCanvasTheme();

      editor.Commands.add("set-device-desktop", {
        run: (ed: any) => ed.setDevice("Desktop"),
      });
      editor.Commands.add("set-device-tablet", {
        run: (ed: any) => ed.setDevice("Tablet"),
      });
      editor.Commands.add("set-device-mobile", {
        run: (ed: any) => ed.setDevice("Mobile"),
      });
    };

    init();

    return () => {
      destroyed = true;
      if (grapeRef.current) {
        grapeRef.current.destroy();
        grapeRef.current = null;
      }
    };
  }, []);

  // Theme sync
  useEffect(() => {
    const editor = grapeRef.current;
    if (!editor) return;
    const frame = editor.Canvas.getFrameEl();
    if (!frame) return;
    const body = frame.contentDocument?.body;
    if (!body) return;
    if (isDark) {
      body.style.backgroundColor = "#0f172a";
      body.style.color = "#f8fafc";
      editorRef.current?.classList.add("gjs-dark");
    } else {
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#0f172a";
      editorRef.current?.classList.remove("gjs-dark");
    }
  }, [isDark]);

  const panels = [
    { id: "blocks" as const, label: "Blocks", icon: Box },
    { id: "layers" as const, label: "Layers", icon: Layers },
    { id: "styles" as const, label: "Styles", icon: Palette },
    { id: "traits" as const, label: "Traits", icon: Type },
  ];

  return (
    <div className={`lp-visual ${fullscreen ? "lp-visual-fullscreen" : ""}`}>
      <style>{`
        [data-theme="light"] .lp-visual {
          --lp-bg: #ffffff;
          --lp-surface: #f8fafc;
          --lp-panel: #ffffff;
          --lp-text: #0f172a;
          --lp-text-secondary: #64748b;
          --lp-border: #e2e8f0;
          --lp-primary: #2563eb;
          --lp-accent: #f1f5f9;
          --lp-ring: rgba(37,99,235,0.25);
        }
        [data-theme="dark"] .lp-visual {
          --lp-bg: #0b1120;
          --lp-surface: #0f172a;
          --lp-panel: #1e293b;
          --lp-text: #f1f5f9;
          --lp-text-secondary: #94a3b8;
          --lp-border: #334155;
          --lp-primary: #3b82f6;
          --lp-accent: #1e293b;
          --lp-ring: rgba(59,130,246,0.3);
        }

        .lp-visual {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--lp-bg);
          color: var(--lp-text);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .lp-visual-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 50;
        }

        .lp-visual-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid var(--lp-border);
          background: var(--lp-panel);
        }
        .lp-visual-toolbar-left {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .lp-visual-toolbtn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .lp-visual-toolbtn:hover {
          color: var(--lp-text);
          background: var(--lp-accent);
        }
        .lp-visual-toolbtn.active {
          color: var(--lp-text);
          background: var(--lp-accent);
        }
        .lp-visual-toolbtn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--lp-ring);
        }
        .lp-visual-fsbtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .lp-visual-fsbtn:hover {
          background: var(--lp-accent);
          color: var(--lp-text);
        }
        .lp-visual-fsbtn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--lp-ring);
        }

        .lp-visual-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .lp-visual-sidebar {
          width: 240px;
          border-right: 1px solid var(--lp-border);
          background: var(--lp-panel);
          overflow-y: auto;
        }
        .lp-visual-canvas-wrap {
          flex: 1;
          position: relative;
          background: var(--lp-surface);
        }
        .lp-visual-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lp-bg);
          z-index: 10;
        }
        .lp-visual-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid var(--lp-border);
          border-top-color: var(--lp-primary);
          border-radius: 50%;
          animation: lp-vspin 0.8s linear infinite;
        }
        @keyframes lp-vspin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="lp-visual-toolbar">
        <div className="lp-visual-toolbar-left">
          {panels.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                className={`lp-visual-toolbtn ${activePanel === p.id ? "active" : ""}`}
                onClick={() => setActivePanel(p.id)}
              >
                <Icon size={14} />
                {p.label}
              </button>
            );
          })}
        </div>
        <button
          className="lp-visual-fsbtn"
          onClick={() => setFullscreen((v) => !v)}
          title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      <div className="lp-visual-body">
        <div className="lp-visual-sidebar">
          <div style={{ display: activePanel === "blocks" ? "block" : "none" }}>
            <div id="gjs-blocks" />
          </div>
          <div style={{ display: activePanel === "layers" ? "block" : "none" }}>
            <div id="gjs-layers" />
          </div>
          <div style={{ display: activePanel === "styles" ? "block" : "none" }}>
            <div id="gjs-styles" />
          </div>
          <div style={{ display: activePanel === "traits" ? "block" : "none" }}>
            <div id="gjs-traits" />
          </div>
        </div>

        <div className="lp-visual-canvas-wrap">
          {loading && (
            <div className="lp-visual-loading">
              <div className="lp-visual-spinner" />
            </div>
          )}
          <div ref={editorRef} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
