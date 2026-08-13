"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import JoditEditor from "jodit-react";
import {
  useGetLandingPageByIdQuery,
  useUpdateLandingPageMutation,
} from "@/store/landingPageApi";
import {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} from "@/store/mediaApi";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Paintbrush,
  Settings,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Upload,
  Trash2,
  Copy,
  Globe,
  Tag,
  Sparkles,
  Zap,
  FileCode,
  X,
} from "lucide-react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false },
);

const VisualEditor = dynamic(
  () =>
    import("@/components/landing-pages/VisualEditor").then(
      (mod) => mod.VisualEditor,
    ),
  { ssr: false },
);

type Tab = "visual" | "html" | "css" | "js" | "settings" | "media";
type Device = "desktop" | "tablet" | "mobile";

export default function LandingPageEditorPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: pageData, isLoading } = useGetLandingPageByIdQuery(id, {
    skip: !id,
  });
  const [updateLandingPage, { isLoading: isSaving }] =
    useUpdateLandingPageMutation();

  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [device, setDevice] = useState<Device>("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [jsContent, setJsContent] = useState("");
  const [settings, setSettings] = useState({
    pageName: "",
    slug: "",
    status: "ACTIVE",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Theme sync
  useEffect(() => {
    const el = document.documentElement;
    const check = () => setIsDark(el.getAttribute("data-theme") === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Load data
  useEffect(() => {
    if (pageData) {
      setHtmlContent(pageData.landingContent || "");
      setCssContent(pageData.cssContent || "");
      setJsContent(pageData.jsContent || "");
      setSettings({
        pageName: pageData.pageName || "",
        slug: pageData.slug || "",
        status: pageData.status || "ACTIVE",
        seoTitle: pageData.seo?.title || "",
        seoDescription: pageData.seo?.description || "",
        seoKeywords: (pageData.seo?.keywords || []).join(", "),
      });
    }
  }, [pageData]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    try {
      await updateLandingPage({
        id,
        pageName: settings.pageName,
        slug: settings.slug,
        status: settings.status,
        landingContent: htmlContent,
        cssContent: cssContent,
        jsContent: jsContent,
        seo: {
          title: settings.seoTitle,
          description: settings.seoDescription,
          keywords: settings.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      }).unwrap();
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch {
      alert("Failed to save landing page");
    }
  }, [id, settings, htmlContent, cssContent, jsContent, updateLandingPage]);

  // Ctrl/Cmd+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  // Inject Jodit theme CSS
  useEffect(() => {
    const styleId = "lp-jodit-theme";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        [data-theme="light"] .jodit-container {
          --jodit-bg: rgba(255,255,255,0.6);
          --jodit-border: rgba(148,163,184,0.25);
          --jodit-text: #1e293b;
          --jodit-toolbar: rgba(255,255,255,0.75);
          --jodit-workplace: #ffffff;
          --jodit-popup: #ffffff;
        }
        [data-theme="dark"] .jodit-container {
          --jodit-bg: rgba(30,41,59,0.5);
          --jodit-border: rgba(148,163,184,0.12);
          --jodit-text: #f8fafc;
          --jodit-toolbar: rgba(15,23,42,0.7);
          --jodit-workplace: #0f172a;
          --jodit-popup: #1e293b;
        }
        .jodit-container {
          background: var(--jodit-bg) !important;
          border: 1px solid var(--jodit-border) !important;
          border-radius: 16px !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          overflow: hidden !important;
          box-shadow: 0 8px 32px rgba(31,38,135,0.07) !important;
          animation: lp-joditIn 0.4s ease-out;
        }
        @keyframes lp-joditIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .jodit-toolbar {
          background: var(--jodit-toolbar) !important;
          border-bottom: 1px solid var(--jodit-border) !important;
          backdrop-filter: blur(8px);
        }
        .jodit-toolbar-button {
          color: var(--jodit-text) !important;
          border-radius: 6px !important;
          transition: all 0.2s !important;
        }
        .jodit-toolbar-button:hover {
          background: rgba(99,102,241,0.15) !important;
          transform: translateY(-1px);
        }
        .jodit-toolbar-button__button {
          color: var(--jodit-text) !important;
        }
        .jodit-workplace {
          background: var(--jodit-workplace) !important;
        }
        .jodit-wysiwyg {
          color: var(--jodit-text) !important;
          background: transparent !important;
          padding: 20px !important;
        }
        .jodit-status-bar {
          background: var(--jodit-toolbar) !important;
          border-top: 1px solid var(--jodit-border) !important;
          color: #94a3b8 !important;
        }
        .jodit-popup {
          background: var(--jodit-popup) !important;
          border: 1px solid var(--jodit-border) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15) !important;
        }
        .jodit-popup__content {
          color: var(--jodit-text) !important;
        }
        .jodit-ui-separator {
          border-color: var(--jodit-border) !important;
        }
        .jodit-toolbar-button__text {
          color: var(--jodit-text) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const joditConfig = {
    readonly: false,
    height: "100%",
    theme: isDark ? "dark" : "default",
    toolbarAdaptive: false,
    uploader: { insertImageAsBase64URI: true },
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    spellcheck: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "link",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "|",
      "fullsize",
      "print",
      "about",
    ],
  };

  const previewSrc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
        <script>try { ${jsContent} } catch(e) { console.error(e); }</script>
      </body>
    </html>
  `;

  const deviceWidths: Record<Device, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "visual", label: "Visual", icon: Paintbrush },
    { id: "html", label: "Editor", icon: Sparkles },
    { id: "css", label: "CSS", icon: FileCode },
    { id: "js", label: "JS", icon: Zap },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="lp-editor-root">
        <style>{themeCss()}</style>
        <div className="lp-loading-screen">
          <div className="lp-shimmer" />
          <div className="lp-loading-text">Loading Editor...</div>
        </div>
      </div>
    );
  }

  if (!pageData && !isLoading) {
    return (
      <div className="lp-editor-root">
        <style>{themeCss()}</style>
        <div className="lp-empty-screen">
          <div className="lp-empty-icon">🚀</div>
          <p>Landing page not found</p>
          <Link href="/admin/landing-pages" className="lp-link">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-editor-root">
      <style>{themeCss()}</style>

      {/* ── GLASS TOP BAR ── */}
      <div className="lp-glass-topbar">
        <div className="lp-topbar-left">
          <Link
            href="/admin/landing-pages"
            className="lp-glass-icon-btn"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="lp-topbar-title">
            <h1>{settings.pageName || "Untitled Page"}</h1>
            <div className="lp-topbar-meta">
              <span className="lp-slug">/{settings.slug}</span>
              <span className="lp-dot" />
              <span
                className={`lp-status-pill lp-status-${settings.status.toLowerCase()}`}
              >
                {settings.status}
              </span>
            </div>
          </div>
          {savedIndicator && (
            <span className="lp-saved-badge">
              <CheckCircle2 size={12} />
              Saved
            </span>
          )}
        </div>

        <div className="lp-topbar-right">
          <div className="lp-glass-segment">
            {[
              { id: "desktop" as Device, icon: Monitor },
              { id: "tablet" as Device, icon: Tablet },
              { id: "mobile" as Device, icon: Smartphone },
            ].map((d) => (
              <button
                key={d.id}
                className={`lp-segment-btn ${device === d.id ? "active" : ""}`}
                onClick={() => setDevice(d.id)}
                title={d.id}
              >
                <d.icon size={14} />
              </button>
            ))}
          </div>

          <button
            className={`lp-glass-btn ${showPreview ? "active" : ""}`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showPreview ? "Hide" : "Preview"}</span>
          </button>

          <button
            className="lp-gradient-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 size={13} className="lp-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ── ANIMATED TABS ── */}
      <div className="lp-glass-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`lp-tab ${active ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} className={active ? "lp-tab-icon-glow" : ""} />
              <span>{tab.label}</span>
              {active && <div className="lp-tab-glow" />}
            </button>
          );
        })}
      </div>

      {/* ── WORKSPACE ── */}
      <div className="lp-workspace">
        {/* Editor Pane */}
        <div
          className={`lp-pane ${showPreview ? "lp-pane-split" : "lp-pane-full"}`}
        >
          {/* VISUAL */}
          {activeTab === "visual" && (
            <div className="lp-pane-fill">
              <VisualEditor
                initialHtml={htmlContent}
                initialCss={cssContent}
                onChange={({ html, css }) => {
                  setHtmlContent(html);
                  setCssContent(css);
                }}
                isDark={isDark}
              />
            </div>
          )}

          {/* JODIT HTML EDITOR */}
          {activeTab === "html" && (
            <div className="lp-pane-fill lp-jodit-wrap">
              <JoditEditor
                value={htmlContent}
                config={joditConfig}
                onBlur={(newContent: string) => setHtmlContent(newContent)}
                onChange={() => {}}
              />
            </div>
          )}

          {/* CSS */}
          {activeTab === "css" && (
            <div className="lp-pane-fill">
              <div className="lp-code-glass">
                <MonacoEditor
                  height="100%"
                  language="css"
                  value={cssContent}
                  onChange={(v) => setCssContent(v || "")}
                  theme={isDark ? "vs-dark" : "light"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    folding: true,
                    renderLineHighlight: "all",
                    matchBrackets: "always",
                  }}
                />
              </div>
            </div>
          )}

          {/* JS */}
          {activeTab === "js" && (
            <div className="lp-pane-fill">
              <div className="lp-code-glass">
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  value={jsContent}
                  onChange={(v) => setJsContent(v || "")}
                  theme={isDark ? "vs-dark" : "light"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    folding: true,
                    renderLineHighlight: "all",
                    matchBrackets: "always",
                  }}
                />
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="lp-scroll">
              <div className="lp-settings-card">
                <div className="lp-card-glow" />
                <div className="lp-form-group">
                  <label className="lp-label">Page Name</label>
                  <input
                    className="lp-glass-input"
                    value={settings.pageName}
                    onChange={(e) =>
                      setSettings({ ...settings, pageName: e.target.value })
                    }
                    placeholder="My Awesome Page"
                  />
                </div>

                <div className="lp-form-group">
                  <label className="lp-label">Slug</label>
                  <div className="lp-input-prefix">
                    <span>/</span>
                    <input
                      className="lp-glass-input"
                      value={settings.slug}
                      onChange={(e) =>
                        setSettings({ ...settings, slug: e.target.value })
                      }
                      placeholder="awesome-page"
                    />
                  </div>
                </div>

                <div className="lp-form-group">
                  <label className="lp-label">Status</label>
                  <select
                    className="lp-glass-select"
                    value={settings.status}
                    onChange={(e) =>
                      setSettings({ ...settings, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">🟢 Active</option>
                    <option value="INACTIVE">🟠 Inactive</option>
                    <option value="DRAFT">⚪ Draft</option>
                  </select>
                </div>
              </div>

              <div className="lp-settings-card lp-mt-4">
                <div className="lp-card-glow lp-glow-purple" />
                <div className="lp-section-title">
                  <Globe size={15} className="lp-gradient-icon" />
                  SEO Settings
                </div>

                <div className="lp-form-group">
                  <label className="lp-label">SEO Title</label>
                  <input
                    className="lp-glass-input"
                    value={settings.seoTitle}
                    onChange={(e) =>
                      setSettings({ ...settings, seoTitle: e.target.value })
                    }
                    placeholder="Page title for Google"
                  />
                </div>

                <div className="lp-form-group">
                  <label className="lp-label">SEO Description</label>
                  <textarea
                    className="lp-glass-textarea"
                    rows={3}
                    value={settings.seoDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seoDescription: e.target.value,
                      })
                    }
                    placeholder="Brief description for search engines..."
                  />
                </div>

                <div className="lp-form-group">
                  <label
                    className="lp-label"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Tag size={13} className="lp-gradient-icon" />
                    Keywords
                  </label>
                  <input
                    className="lp-glass-input"
                    value={settings.seoKeywords}
                    onChange={(e) =>
                      setSettings({ ...settings, seoKeywords: e.target.value })
                    }
                    placeholder="marketing, landing, summer sale"
                  />
                  <p className="lp-hint">Separate keywords with commas</p>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA */}
          {activeTab === "media" && <MediaTab isDark={isDark} />}
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className="lp-preview-pane">
            <div
              className="lp-device-frame"
              style={{ width: deviceWidths[device] }}
            >
              <div className="lp-device-notch" />
              <iframe
                title="Preview"
                srcDoc={previewSrc}
                className="lp-preview-iframe"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Media Tab ───────────────────────────────────────────────

function MediaTab({ isDark }: { isDark: boolean }) {
  const [folder] = useState("landing-pages");
  const { data: mediaData, isLoading } = useGetMediaQuery({ folder });
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resources = mediaData?.resources || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }),
    );
    const images = await Promise.all(readers);
    try {
      await uploadMedia({ folder, images }).unwrap();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      alert("Upload failed");
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteMedia({ publicIds: [publicId] }).unwrap();
    } catch {
      alert("Delete failed");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="lp-scroll">
      <div className="lp-media-header">
        <h3>Media Library</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className="lp-gradient-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 size={13} className="lp-spin" />
          ) : (
            <Upload size={13} />
          )}
          <span>Upload</span>
        </button>
      </div>

      {isLoading ? (
        <div className="lp-media-loading">
          <div className="lp-shimmer-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="lp-shimmer-card" />
            ))}
          </div>
        </div>
      ) : resources.length === 0 ? (
        <div className="lp-media-empty">
          <div className="lp-empty-illustration">
            <ImageIcon size={40} className="lp-gradient-icon" />
          </div>
          <p>No media found</p>
          <span>Upload images to use in your landing pages</span>
          <button
            className="lp-gradient-btn lp-mt-3"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            Upload First Image
          </button>
        </div>
      ) : (
        <div className="lp-media-grid">
          {resources.map((asset: any) => (
            <div key={asset.publicId} className="lp-media-card">
              <img src={asset.secureUrl || asset.url} alt="" loading="lazy" />
              <div className="lp-media-card-overlay">
                <button
                  className="lp-media-action"
                  title="Copy URL"
                  onClick={() => handleCopy(asset.secureUrl || asset.url)}
                >
                  <Copy size={14} />
                </button>
                <button
                  className="lp-media-action danger"
                  title="Delete"
                  onClick={() => handleDelete(asset.publicId)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="lp-media-card-name">
                {asset.publicId.split("/").pop()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Theme CSS ───────────────────────────────────────────────

function themeCss() {
  return `
    /* ── Theme Tokens ── */
    [data-theme="light"] .lp-editor-root {
      --lp-bg: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 30%, #f5f3ff 60%, #ecfdf5 100%);
      --lp-surface: rgba(255,255,255,0.55);
      --lp-panel: rgba(255,255,255,0.7);
      --lp-panel-solid: #ffffff;
      --lp-text: #1e293b;
      --lp-text-secondary: #64748b;
      --lp-border: rgba(148,163,184,0.2);
      --lp-primary: #4f46e5;
      --lp-primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%);
      --lp-accent: rgba(99,102,241,0.08);
      --lp-glow: rgba(79,70,229,0.2);
      --lp-ring: rgba(79,70,229,0.35);
      --lp-shadow: 0 8px 32px rgba(31,38,135,0.1);
      --lp-glass: rgba(255,255,255,0.45);
      --lp-success: #10b981;
      --lp-danger: #ef4444;
      --lp-code-bg: #fafafa;
    }
    [data-theme="dark"] .lp-editor-root {
      --lp-bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #1e293b 100%);
      --lp-surface: rgba(30,41,59,0.4);
      --lp-panel: rgba(15,23,42,0.6);
      --lp-panel-solid: #1e293b;
      --lp-text: #f8fafc;
      --lp-text-secondary: #94a3b8;
      --lp-border: rgba(148,163,184,0.12);
      --lp-primary: #818cf8;
      --lp-primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #3b82f6 100%);
      --lp-accent: rgba(99,102,241,0.1);
      --lp-glow: rgba(99,102,241,0.3);
      --lp-ring: rgba(99,102,241,0.45);
      --lp-shadow: 0 8px 32px rgba(0,0,0,0.45);
      --lp-glass: rgba(15,23,42,0.4);
      --lp-success: #34d399;
      --lp-danger: #f87171;
      --lp-code-bg: #0f172a;
    }

    /* ── Root ── */
    .lp-editor-root {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 4rem);
      background: var(--lp-bg);
      background-attachment: fixed;
      color: var(--lp-text);
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
    }

    /* ── Animations ── */
    @keyframes lp-fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes lp-glowPulse {
      0%, 100% { box-shadow: 0 0 5px var(--lp-glow); }
      50% { box-shadow: 0 0 20px var(--lp-glow), 0 0 40px var(--lp-glow); }
    }
    @keyframes lp-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes lp-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes lp-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes lp-slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .lp-spin { animation: lp-spin 0.8s linear infinite; }
    .lp-tab-icon-glow { filter: drop-shadow(0 0 6px var(--lp-glow)); }

    /* ── Loading & Empty Screens ── */
    .lp-loading-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 20px;
      animation: lp-fadeIn 0.5s ease-out;
    }
    .lp-shimmer {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(90deg, var(--lp-border) 25%, var(--lp-accent) 50%, var(--lp-border) 75%);
      background-size: 200% 100%;
      animation: lp-shimmer 1.5s infinite;
    }
    .lp-loading-text {
      font-size: 14px;
      color: var(--lp-text-secondary);
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .lp-empty-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
      animation: lp-fadeIn 0.5s ease-out;
      color: var(--lp-text-secondary);
    }
    .lp-empty-icon {
      font-size: 48px;
      animation: lp-float 3s ease-in-out infinite;
    }
    .lp-empty-screen p {
      font-size: 16px;
      font-weight: 600;
      color: var(--lp-text);
      margin: 0;
    }
    .lp-link {
      color: var(--lp-primary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      background: var(--lp-accent);
      transition: all 0.2s;
    }
    .lp-link:hover {
      box-shadow: 0 0 15px var(--lp-glow);
      transform: translateY(-1px);
    }

    /* ── Glass Top Bar ── */
    .lp-glass-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      margin: 12px 16px 0;
      background: var(--lp-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--lp-border);
      border-radius: 16px;
      box-shadow: var(--lp-shadow);
      gap: 12px;
      flex-shrink: 0;
      animation: lp-slideUp 0.4s ease-out;
      position: relative;
      overflow: hidden;
    }
    .lp-glass-topbar::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--lp-primary), transparent);
      opacity: 0.5;
    }
    .lp-topbar-left {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .lp-glass-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid var(--lp-border);
      background: var(--lp-surface);
      color: var(--lp-text-secondary);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
    }
    .lp-glass-icon-btn:hover {
      background: var(--lp-accent);
      color: var(--lp-primary);
      border-color: var(--lp-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--lp-glow);
    }
    .lp-glass-icon-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--lp-ring);
      outline: none;
    }
    .lp-topbar-title {
      min-width: 0;
    }
    .lp-topbar-title h1 {
      font-size: 15px;
      font-weight: 700;
      margin: 0;
      background: var(--lp-primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }
    .lp-topbar-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 3px;
    }
    .lp-slug {
      font-size: 11px;
      color: var(--lp-text-secondary);
      font-family: "SF Mono", monospace;
    }
    .lp-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--lp-text-secondary);
      opacity: 0.5;
    }
    .lp-status-pill {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .lp-status-active {
      background: rgba(16,185,129,0.15);
      color: #10b981;
    }
    .lp-status-inactive {
      background: rgba(245,158,11,0.15);
      color: #f59e0b;
    }
    .lp-status-draft {
      background: rgba(148,163,184,0.15);
      color: #94a3b8;
    }
    [data-theme="dark"] .lp-status-active { color: #34d399; }
    [data-theme="dark"] .lp-status-inactive { color: #fbbf24; }
    .lp-saved-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 600;
      color: var(--lp-success);
      background: rgba(16,185,129,0.1);
      padding: 4px 10px;
      border-radius: 20px;
      animation: lp-fadeIn 0.3s ease-out;
    }

    .lp-topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* ── Glass Segment ── */
    .lp-glass-segment {
      display: inline-flex;
      align-items: center;
      background: var(--lp-surface);
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      padding: 3px;
      backdrop-filter: blur(8px);
    }
    .lp-segment-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--lp-text-secondary);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .lp-segment-btn:hover {
      color: var(--lp-text);
      background: var(--lp-accent);
    }
    .lp-segment-btn.active {
      background: var(--lp-primary-gradient);
      color: #fff;
      box-shadow: 0 4px 12px var(--lp-glow);
    }
    .lp-segment-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--lp-ring);
      outline: none;
    }

    /* ── Glass Button ── */
    .lp-glass-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      font-family: inherit;
      background: var(--lp-surface);
      color: var(--lp-text);
      backdrop-filter: blur(8px);
    }
    .lp-glass-btn:hover {
      background: var(--lp-accent);
      border-color: var(--lp-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px var(--lp-glow);
    }
    .lp-glass-btn.active {
      background: var(--lp-accent);
      border-color: var(--lp-primary);
      color: var(--lp-primary);
    }
    .lp-glass-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--lp-ring);
    }

    /* ── Gradient Button ── */
    .lp-gradient-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      border-radius: 12px;
      padding: 7px 16px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      font-family: inherit;
      background: var(--lp-primary-gradient);
      color: #fff;
      box-shadow: 0 4px 15px var(--lp-glow);
      position: relative;
      overflow: hidden;
    }
    .lp-gradient-btn::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s;
    }
    .lp-gradient-btn:hover::before {
      transform: translateX(100%);
    }
    .lp-gradient-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--lp-glow);
    }
    .lp-gradient-btn:active {
      transform: translateY(0) scale(0.98);
    }
    .lp-gradient-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .lp-gradient-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--lp-ring), 0 4px 15px var(--lp-glow);
    }

    /* ── Glass Tabs ── */
    .lp-glass-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      margin: 8px 16px 0;
      background: var(--lp-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--lp-border);
      border-radius: 16px;
      box-shadow: var(--lp-shadow);
      overflow-x: auto;
      flex-shrink: 0;
      animation: lp-slideUp 0.5s ease-out 0.1s both;
    }
    .lp-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: var(--lp-text-secondary);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      font-family: inherit;
      position: relative;
    }
    .lp-tab:hover {
      color: var(--lp-text);
      background: var(--lp-accent);
    }
    .lp-tab.active {
      color: #fff;
      background: var(--lp-primary-gradient);
      box-shadow: 0 4px 15px var(--lp-glow);
    }
    .lp-tab:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--lp-ring);
    }
    .lp-tab-glow {
      position: absolute;
      inset: -2px;
      border-radius: 14px;
      background: var(--lp-primary-gradient);
      opacity: 0.3;
      filter: blur(8px);
      z-index: -1;
      animation: lp-glowPulse 2s ease-in-out infinite;
    }

    /* ── Workspace ── */
    .lp-workspace {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 12px 16px 16px;
      gap: 16px;
    }
    .lp-pane {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--lp-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--lp-border);
      border-radius: 20px;
      box-shadow: var(--lp-shadow);
      animation: lp-slideUp 0.5s ease-out 0.15s both;
    }
    .lp-pane-split {
      width: 50%;
      flex: none;
    }
    .lp-pane-full {
      width: 100%;
    }
    .lp-pane-fill {
      flex: 1;
      min-height: 0;
      position: relative;
      padding: 12px;
    }
    .lp-jodit-wrap {
      padding: 0;
      overflow: hidden;
    }
    .lp-jodit-wrap .jodit-container {
      height: 100% !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      backdrop-filter: none !important;
    }
    .lp-jodit-wrap .jodit-workplace {
      min-height: calc(100% - 80px) !important;
    }

    /* ── Code Glass ── */
    .lp-code-glass {
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--lp-border);
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
    }

    /* ── Scroll Panel ── */
    .lp-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    /* ── Settings Cards ── */
    .lp-settings-card {
      position: relative;
      background: var(--lp-glass);
      backdrop-filter: blur(12px);
      border: 1px solid var(--lp-border);
      border-radius: 20px;
      padding: 24px;
      overflow: hidden;
      animation: lp-slideUp 0.5s ease-out 0.2s both;
    }
    .lp-card-glow {
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--lp-glow) 0%, transparent 70%);
      pointer-events: none;
    }
    .lp-glow-purple {
      background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    }
    .lp-mt-3 { margin-top: 12px; }
    .lp-mt-4 { margin-top: 16px; }

    /* ── Form Elements ── */
    .lp-form-group {
      margin-bottom: 20px;
    }
    .lp-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: var(--lp-text);
      margin-bottom: 8px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .lp-glass-input,
    .lp-glass-select,
    .lp-glass-textarea {
      width: 100%;
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      background: var(--lp-surface);
      color: var(--lp-text);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(8px);
    }
    .lp-glass-input:focus,
    .lp-glass-select:focus,
    .lp-glass-textarea:focus {
      border-color: var(--lp-primary);
      box-shadow: 0 0 0 4px var(--lp-ring), 0 4px 20px var(--lp-glow);
      transform: translateY(-1px);
    }
    .lp-glass-input {
      height: 40px;
      padding: 0 14px;
    }
    .lp-glass-input::placeholder {
      color: var(--lp-text-secondary);
      opacity: 0.6;
    }
    .lp-glass-select {
      height: 40px;
      padding: 0 14px;
      cursor: pointer;
    }
    .lp-glass-textarea {
      padding: 12px 14px;
      resize: vertical;
      min-height: 90px;
    }
    .lp-hint {
      font-size: 11px;
      color: var(--lp-text-secondary);
      margin: 6px 0 0;
      font-weight: 500;
    }
    .lp-input-prefix {
      display: flex;
      gap: 0;
    }
    .lp-input-prefix span {
      display: inline-flex;
      align-items: center;
      padding: 0 14px;
      border: 1px solid var(--lp-border);
      border-right: none;
      border-radius: 12px 0 0 12px;
      background: var(--lp-accent);
      color: var(--lp-text-secondary);
      font-size: 13px;
      font-weight: 600;
    }
    .lp-input-prefix input {
      border-radius: 0 12px 12px 0;
      flex: 1;
    }
    .lp-section-title {
      font-size: 14px;
      font-weight: 800;
      margin: 0 0 20px;
      color: var(--lp-text);
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.02em;
    }
    .lp-gradient-icon {
      color: var(--lp-primary);
      filter: drop-shadow(0 0 4px var(--lp-glow));
    }

    /* ── Preview ── */
    .lp-preview-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      padding: 16px;
      animation: lp-slideUp 0.5s ease-out 0.2s both;
    }
    .lp-device-frame {
      background: var(--lp-panel-solid);
      border: 1px solid var(--lp-border);
      border-radius: 24px;
      box-shadow: var(--lp-shadow), 0 0 60px var(--lp-glow);
      overflow: hidden;
      height: 100%;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .lp-device-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 24px;
      background: var(--lp-panel-solid);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      z-index: 10;
      border: 1px solid var(--lp-border);
      border-top: none;
      display: none;
    }
    .lp-preview-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    /* ── Media ── */
    .lp-media-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .lp-media-header h3 {
      font-size: 14px;
      font-weight: 800;
      margin: 0;
      color: var(--lp-text);
      letter-spacing: -0.01em;
    }
    .lp-media-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .lp-shimmer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
      width: 100%;
    }
    .lp-shimmer-card {
      aspect-ratio: 1;
      border-radius: 16px;
      background: linear-gradient(90deg, var(--lp-border) 25%, var(--lp-accent) 50%, var(--lp-border) 75%);
      background-size: 200% 100%;
      animation: lp-shimmer 1.5s infinite;
    }
    .lp-media-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--lp-text-secondary);
      text-align: center;
      animation: lp-fadeIn 0.5s ease-out;
    }
    .lp-empty-illustration {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: var(--lp-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 8px 30px var(--lp-glow);
    }
    .lp-media-empty p {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--lp-text);
    }
    .lp-media-empty span {
      font-size: 13px;
      margin-top: 6px;
      color: var(--lp-text-secondary);
    }
    .lp-media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
      animation: lp-fadeIn 0.4s ease-out;
    }
    .lp-media-card {
      position: relative;
      aspect-ratio: 1;
      border-radius: 16px;
      border: 1px solid var(--lp-border);
      background: var(--lp-panel);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .lp-media-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 40px var(--lp-glow);
      border-color: var(--lp-primary);
    }
    .lp-media-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s;
    }
    .lp-media-card:hover img {
      transform: scale(1.1);
    }
    .lp-media-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 12px;
      padding-bottom: 16px;
      opacity: 0;
      transition: all 0.35s;
    }
    .lp-media-card:hover .lp-media-card-overlay {
      opacity: 1;
    }
    .lp-media-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      border: none;
      background: rgba(255,255,255,0.15);
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(8px);
    }
    .lp-media-action:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.1);
    }
    .lp-media-action.danger:hover {
      background: var(--lp-danger);
    }
    .lp-media-card-name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(transparent, rgba(0,0,0,0.6));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
    }

    /* ── Scrollbars ── */
    .lp-editor-root ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .lp-editor-root ::-webkit-scrollbar-track {
      background: transparent;
    }
    .lp-editor-root ::-webkit-scrollbar-thumb {
      background: var(--lp-border);
      border-radius: 4px;
    }
    .lp-editor-root ::-webkit-scrollbar-thumb:hover {
      background: var(--lp-text-secondary);
    }
  `;
}
