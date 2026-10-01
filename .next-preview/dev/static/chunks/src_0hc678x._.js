(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/storefront/Storefront.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartStorefront",
    ()=>CartStorefront,
    "CatalogStorefront",
    ()=>CatalogStorefront,
    "CheckoutStorefront",
    ()=>CheckoutStorefront,
    "HomeStorefront",
    ()=>HomeStorefront,
    "ProductCard",
    ()=>ProductCard,
    "ProductDetailStorefront",
    ()=>ProductDetailStorefront,
    "StorefrontFooter",
    ()=>StorefrontFooter,
    "StorefrontFrame",
    ()=>StorefrontFrame,
    "StorefrontHeader",
    ()=>StorefrontHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.31.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/user-round.mjs [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-redux@9.3.0_@types+re_d2337efa717268ab182fc448083bb9fa/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tracking.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/publicApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartSlice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const imageOf = (product)=>product?.thumbnailImage?.secureUrl || product?.thumbnailImage?.url || (typeof product?.images?.[0] === "string" ? product.images[0] : product?.images?.[0]?.secureUrl || product?.images?.[0]?.url) || "";
const priceOf = (item)=>Number(item.product.variants?.find((variant)=>variant.id === item.variantId)?.price ?? item.product.price) || 0;
const productsFrom = (data)=>{
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
        const value = data;
        return value.products ?? value.items ?? [];
    }
    return [];
};
function useStorefrontTracking(settings) {
    _s();
    const [send] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackAnalyticsEventMutation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStorefrontTracking.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeBrowserPixels"])({
                facebookPixelId: settings?.store?.socialTracking?.facebook?.enabled ? settings.store.socialTracking.facebook.pixelId : undefined,
                tiktokPixelId: settings?.store?.socialTracking?.tiktok?.enabled ? settings.store.socialTracking.tiktok.pixelId : undefined
            });
        }
    }["useStorefrontTracking.useEffect"], [
        settings
    ]);
    return (eventType, payload, key)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackStorefrontEvent"])({
            eventType,
            eventName: eventType === "product_view" ? "view_content" : eventType,
            payload: {
                ...payload,
                currency: settings?.store?.currency || "BDT"
            }
        }, key, send);
    };
}
_s(useStorefrontTracking, "l/8mNowbnlmFQFHAu3JGlotdlDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackAnalyticsEventMutation"]
    ];
});
function StorefrontHeader({ announcement, settings, categories = [] } = {}) {
    _s1();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])({
        "StorefrontHeader.useSelector[items]": (state)=>state.cart.items
    }["StorefrontHeader.useSelector[items]"]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const count = items.reduce((total, item)=>total + item.quantity, 0);
    const logoUrl = settings?.branding?.logoUrl || settings?.branding?.logo || settings?.store?.logoUrl || settings?.store?.logo;
    const storeName = settings?.branding?.storeName || settings?.store?.storeName || settings?.store?.name || "";
    const announcementText = announcement || settings?.store?.announcement;
    const submitSearch = (event)=>{
        event.preventDefault();
        if (search.trim()) router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "storefront-header",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "storefront-container storefront-header-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "storefront-logo",
                            children: logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: logoUrl,
                                alt: storeName
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "storefront-mark",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 145,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, this),
                                    storeName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "storefront-brand-name",
                                        children: storeName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 148,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "storefront-search",
                            onSubmit: submitSearch,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    size: 17
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "aria-label": "Search products",
                                    placeholder: "Search products",
                                    value: search,
                                    onChange: (event)=>setSearch(event.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    "aria-label": "Submit search",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "storefront-utility-links",
                            children: [
                                settings?.contact?.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this),
                                        Object.values(settings.contact.address).filter(Boolean).join(", ")
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "storefront-account-link",
                                    href: "/login",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        " Sign in"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "storefront-category-bar",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "storefront-container storefront-nav",
                        "aria-label": "Shop departments",
                        children: [
                            announcementText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "storefront-location",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this),
                                    " ",
                                    announcementText
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: pathname === "/" ? "active" : "",
                                href: "/",
                                children: "All departments"
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 189,
                                columnNumber: 13
                            }, this),
                            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products?category=${encodeURIComponent(category.slug)}`,
                                    children: category.name
                                }, category.id, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "storefront-cart-link",
                                href: "/cart",
                                "aria-label": `Cart with ${count} items`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            count,
                                            " ·",
                                            " ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(items.reduce((sum, item)=>sum + priceOf(item) * item.quantity, 0), settings?.store?.currency)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s1(StorefrontHeader, "VTpN3Tujz5syeG8QNWr4eye359U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
_c = StorefrontHeader;
function StorefrontFooter({ content, settings, categories = [] } = {}) {
    const logoUrl = settings?.branding?.logoUrl || settings?.branding?.logo || settings?.store?.logoUrl || settings?.store?.logo;
    const storeName = settings?.branding?.storeName || settings?.store?.storeName || settings?.store?.name || "";
    const contact = settings?.contact;
    const address = contact?.address ? Object.values(contact.address).filter(Boolean).join(", ") : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "storefront-footer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "storefront-container footer-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "storefront-logo light",
                                children: logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: logoUrl,
                                    alt: storeName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: storeName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            content?.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: content.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 258,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Shop by department"
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/products",
                                children: "All products"
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products?category=${encodeURIComponent(category.slug)}`,
                                    children: category.name
                                }, category.id, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cart",
                                children: "Your cart"
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: content?.supportLabel || "Need help?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this),
                            contact?.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: contact.phone
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 275,
                                columnNumber: 30
                            }, this),
                            (content?.supportEmail || contact?.email) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: content?.supportEmail || contact?.email
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: address
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 279,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "storefront-container footer-bottom",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "© ",
                        new Date().getFullYear(),
                        " ",
                        storeName
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 283,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
_c1 = StorefrontFooter;
function StorefrontFrame({ children, homePage, settings, categories = [] }) {
    _s2();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [send] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackAnalyticsEventMutation"])();
    useStorefrontTracking(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StorefrontFrame.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackStorefrontEvent"])({
                eventType: "page_view",
                eventName: "page_view",
                payload: {
                    page: pathname
                },
                url: window.location.href
            }, `storefront-page-view-${pathname}`, send);
        }
    }["StorefrontFrame.useEffect"], [
        pathname,
        send
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontHeader, {
                announcement: homePage?.footer.announcement,
                settings: settings,
                categories: categories
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFooter, {
                content: homePage?.footer,
                settings: settings,
                categories: categories
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 318,
        columnNumber: 5
    }, this);
}
_s2(StorefrontFrame, "Ac6hlnTwRkemPZ4mOr3g9hZqLRU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackAnalyticsEventMutation"],
        useStorefrontTracking
    ];
});
_c2 = StorefrontFrame;
function ProductCard({ product, index = 0, settings }) {
    _s3();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const track = useStorefrontTracking(settings);
    const [added, setAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const href = `/products/${product.slug || product.id}`;
    const defaultVariantId = product.variants?.[0]?.id;
    const productPrice = Number(product.variants?.[0]?.price ?? product.price) || 0;
    const add = ()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCart"])({
            product,
            quantity: 1,
            variantId: defaultVariantId
        }));
        track("add_to_cart", {
            contentIds: [
                product.id
            ],
            contentName: product.name,
            value: product.price,
            quantity: 1
        }, `product-card-add-${product.id}`);
        setAdded(true);
        window.setTimeout(()=>setAdded(false), 1600);
    };
    const orderNow = ()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCart"])({
            product,
            quantity: 1,
            variantId: defaultVariantId
        }));
        track("add_to_cart", {
            contentIds: [
                product.id
            ],
            contentName: product.name,
            value: product.price,
            quantity: 1
        }, `product-card-order-${product.id}`);
        router.push("/checkout");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "product-card",
        style: {
            animationDelay: `${index * 70}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: "product-image",
                children: [
                    product.isFeatured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "product-badge",
                        children: "Best seller"
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this),
                    imageOf(product) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imageOf(product),
                        alt: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "image-placeholder",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                            size: 28,
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 393,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 392,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-card-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: "product-name",
                            children: product.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 399,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        className: "product-price",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(productPrice, settings?.store?.currency)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 397,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-card-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `product-add ${added ? "is-added" : ""}`,
                        onClick: add,
                        children: added ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 414,
                                    columnNumber: 15
                                }, this),
                                " Added"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 413,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 418,
                                    columnNumber: 15
                                }, this),
                                " Add to cart"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 417,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "product-order-now",
                        onClick: orderNow,
                        children: [
                            "Buy now ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 423,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 422,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 407,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 381,
        columnNumber: 5
    }, this);
}
_s3(ProductCard, "a9vuJgYC3XIhEX25Mi/UasWPx5I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useStorefrontTracking
    ];
});
_c3 = ProductCard;
function HomeStorefront({ initialProducts, initialHomePage, settings, categories = [] }) {
    _s4();
    const homePage = initialHomePage;
    const slides = homePage?.hero?.slides.filter((slide)=>slide.isActive).sort((a, b)=>a.sortOrder - b.sortOrder) ?? [];
    const [slideIndex, setSlideIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const activeSlide = slides[Math.min(slideIndex, Math.max(slides.length - 1, 0))];
    const products = productsFrom(initialProducts).filter((product)=>product);
    const configuredProducts = homePage?.bestsellers?.productIds.length ? homePage.bestsellers.productIds.map((id)=>products.find((product)=>product.id === id)).filter(Boolean) : products;
    const homepageCategories = (homePage?.categories ?? []).flatMap((selection)=>{
        const category = categories.find((candidate)=>candidate.id === selection.id);
        return category ? [
            {
                category,
                selection
            }
        ] : [];
    });
    const hasHomepageSections = Boolean(slides.length || homepageCategories.length || homePage?.banners.items.some((banner)=>banner.isActive) || homePage?.bestsellers.title.trim() || homePage?.categoryProducts.some((section)=>section.title.trim()) || homePage?.promise.items.length);
    useStorefrontTracking(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeStorefront.useEffect": ()=>{
            if (!homePage?.hero.autoplay || slides.length < 2) return;
            const timer = window.setInterval({
                "HomeStorefront.useEffect.timer": ()=>setSlideIndex({
                        "HomeStorefront.useEffect.timer": (current)=>(current + 1) % slides.length
                    }["HomeStorefront.useEffect.timer"])
            }["HomeStorefront.useEffect.timer"], homePage.hero.intervalMs);
            return ({
                "HomeStorefront.useEffect": ()=>window.clearInterval(timer)
            })["HomeStorefront.useEffect"];
        }
    }["HomeStorefront.useEffect"], [
        homePage?.hero.autoplay,
        homePage?.hero.intervalMs,
        slides.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeStorefront.useEffect": ()=>{
            setSlideIndex(0);
        }
    }["HomeStorefront.useEffect"], [
        slides.length
    ]);
    if (!homePage || !hasHomepageSections) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
            settings: settings,
            categories: categories,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "storefront-main storefront-api-home",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "storefront-container storefront-api-hero",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "storefront-api-hero-copy",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: settings?.store?.name || settings?.branding?.storeName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 490,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: settings?.store?.name || settings?.branding?.storeName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 493,
                                        columnNumber: 15
                                    }, this),
                                    settings?.store?.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: settings.store.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/products",
                                        className: "button button-dark",
                                        children: [
                                            "Shop all products ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 17
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 498,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 497,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 489,
                                columnNumber: 13
                            }, this),
                            (settings?.branding?.logoUrl || settings?.branding?.logo) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "storefront-api-hero-logo",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: settings.branding.logoUrl || settings.branding.logo,
                                    alt: settings?.store?.name || "Store logo"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 503,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 502,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 488,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "storefront-container storefront-api-category-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eyebrow",
                                                children: "Shop"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 513,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Browse categories"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 514,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 512,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/products",
                                        className: "text-link",
                                        children: [
                                            "All products ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 517,
                                                columnNumber: 30
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 516,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 511,
                                columnNumber: 13
                            }, this),
                            categories.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "category-links",
                                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products?category=${encodeURIComponent(category.slug)}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    (category.image?.secureUrl || category.image?.url) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        className: "category-image",
                                                        src: category.image.secureUrl || category.image.url,
                                                        alt: ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: category.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 527,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 537,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, category.id, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 523,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 521,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "storefront-api-empty-note",
                                children: "No categories have been published yet."
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 542,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 510,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "storefront-container product-section storefront-api-products",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eyebrow",
                                                children: "Catalog"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 550,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Products"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 549,
                                        columnNumber: 15
                                    }, this),
                                    products.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "catalog-count",
                                        children: [
                                            products.length,
                                            " products"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 554,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 548,
                                columnNumber: 13
                            }, this),
                            products.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-grid",
                                children: products.map((product, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                                        product: product,
                                        index: index,
                                        settings: settings
                                    }, product.id, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 562,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 560,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyProducts, {}, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 571,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 547,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 487,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 486,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        homePage: homePage,
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-main",
            children: [
                homePage.visibility?.hero !== false && activeSlide && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "storefront-hero",
                    style: {
                        backgroundImage: activeSlide.imageUrl ? `url(${activeSlide.imageUrl})` : undefined
                    },
                    "aria-label": "Featured collection",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hero-overlay"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 596,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "storefront-container hero-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hero-copy",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "eyebrow",
                                            children: activeSlide.eyebrow
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 599,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            children: [
                                                activeSlide.title,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    children: activeSlide.emphasis
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 603,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 600,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: activeSlide.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 605,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: activeSlide.buttonHref || "/products",
                                            className: "button button-dark",
                                            children: [
                                                activeSlide.buttonLabel,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    size: 17
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 606,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 598,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hero-slider-controls",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "aria-label": "Previous slide",
                                            onClick: ()=>setSlideIndex((current)=>current === 0 ? slides.length - 1 : current - 1),
                                            disabled: slides.length < 2,
                                            children: "←"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 614,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hero-slide-count",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: String(slideIndex + 1).padStart(2, "0")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "/ ",
                                                        String(slides.length).padStart(2, "0")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 626,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "aria-label": "Next slide",
                                            onClick: ()=>setSlideIndex((current)=>(current + 1) % slides.length),
                                            disabled: slides.length < 2,
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 630,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 613,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hero-slide-dots",
                                    "aria-label": "Choose slide",
                                    children: slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: index === slideIndex ? "active" : "",
                                            "aria-label": `Go to slide ${index + 1}`,
                                            "aria-current": index === slideIndex ? "true" : undefined,
                                            onClick: ()=>setSlideIndex(index)
                                        }, slide.id, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 643,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 641,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 597,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 587,
                    columnNumber: 11
                }, this),
                homePage.visibility?.categories !== false && homepageCategories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "storefront-container category-strip",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: homePage.categorySection.eyebrow
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 660,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: homePage.categorySection.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 663,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 659,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "category-links",
                            children: homepageCategories.map(({ category, selection })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products?category=${encodeURIComponent(category.slug)}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                category.image?.secureUrl || category.image?.url || selection.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    className: "category-image",
                                                    src: category.image?.secureUrl || category.image?.url || selection.imageUrl,
                                                    alt: ""
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 675,
                                                    columnNumber: 25
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: category.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 23
                                                }, this),
                                                (selection.description || category.description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: selection.description || category.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 671,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 692,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, category.id, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 667,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 665,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 658,
                    columnNumber: 13
                }, this),
                homePage.visibility?.bestsellers !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "storefront-container product-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "eyebrow",
                                            children: homePage.bestsellers.eyebrow
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 702,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: homePage.bestsellers.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 703,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 701,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/products",
                                    className: "text-link",
                                    children: [
                                        homePage.bestsellers.viewAllLabel,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 706,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 705,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 700,
                            columnNumber: 13
                        }, this),
                        products.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "product-grid",
                            children: configuredProducts.slice(0, homePage.bestsellers.limit || 8).map((product, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                                    product: product,
                                    index: index,
                                    settings: settings
                                }, product.id, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 714,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 710,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyProducts, {}, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 723,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 699,
                    columnNumber: 11
                }, this),
                homePage.visibility?.banners !== false && homePage.banners.items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeBanners, {
                    banners: homePage.banners
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 729,
                    columnNumber: 13
                }, this),
                homePage.visibility?.categoryProducts !== false && homePage.categoryProducts?.map((section)=>{
                    const sectionProducts = section.productIds.length ? section.productIds.map((id)=>products.find((product)=>product.id === id)).filter(Boolean) : products.filter((product)=>product.categories?.includes(section.categoryId));
                    if (!sectionProducts.length) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "storefront-container product-section category-product-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eyebrow",
                                                children: section.eyebrow
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 748,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: section.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 749,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 747,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products?category=${section.categoryId}`,
                                        className: "text-link",
                                        children: [
                                            homePage.bestsellers.viewAllLabel,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 755,
                                                columnNumber: 57
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 751,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 746,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-grid",
                                children: sectionProducts.slice(0, Math.min(section.limit || 10, 10)).map((product, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                                        product: product,
                                        index: index,
                                        settings: settings
                                    }, product.id, false, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 762,
                                        columnNumber: 23
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                lineNumber: 758,
                                columnNumber: 17
                            }, this)
                        ]
                    }, section.categoryId, true, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 742,
                        columnNumber: 15
                    }, this);
                }),
                homePage.visibility?.promise !== false && homePage.promise.items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "storefront-container promise-band",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: homePage.promise.eyebrow
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 777,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: [
                                        homePage.promise.title,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 780,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            children: homePage.promise.emphasis
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 781,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 778,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 776,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "promise-items",
                            children: homePage.promise.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: item.number
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 787,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: item.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 788,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, item.number, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 786,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 784,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 775,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 585,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 580,
        columnNumber: 5
    }, this);
}
_s4(HomeStorefront, "7jK6t+JB64KYrHAp7W2tGwwwc4c=", false, function() {
    return [
        useStorefrontTracking
    ];
});
_c4 = HomeStorefront;
function HomeBanners({ banners }) {
    const items = banners.items.filter((item)=>item.isActive).sort((a, b)=>a.sortOrder - b.sortOrder).slice(0, 2);
    if (!items.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "storefront-container home-banners",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section-heading",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "eyebrow",
                            children: banners.eyebrow
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 809,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: banners.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 810,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 808,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 807,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "home-banner-grid",
                children: items.map((banner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: banner.href || "/products",
                        className: "home-banner-card",
                        style: {
                            backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : undefined
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "home-banner-overlay",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: banner.eyebrow
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 826,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: banner.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 827,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 825,
                            columnNumber: 13
                        }, this)
                    }, banner.id, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 815,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 813,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 806,
        columnNumber: 5
    }, this);
}
_c5 = HomeBanners;
function CatalogStorefront({ initialProducts, settings, initialCategory = "all", initialSearch = "", categories = [] }) {
    _s5();
    const products = productsFrom(initialProducts).filter((product)=>product.isActive !== false);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCategory);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSearch);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("featured");
    const filtered = products.filter((product)=>filter === "all" || product.categories?.some((category)=>category === filter)).filter((product)=>product.name.toLowerCase().includes(query.toLowerCase())).sort((first, second)=>{
        if (sortBy === "price-low") return Number(first.price) - Number(second.price);
        if (sortBy === "price-high") return Number(second.price) - Number(first.price);
        if (sortBy === "newest") return Date.parse(second.createdAt ?? "") - Date.parse(first.createdAt ?? "");
        if (sortBy === "popular") return (second.salesCount ?? 0) - (first.salesCount ?? 0);
        return Number(Boolean(second.isFeatured)) - Number(Boolean(first.isFeatured));
    });
    const categoryLabel = categories.find((category)=>category.id === filter)?.name;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container catalog-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "catalog-breadcrumb",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 886,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 887,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: categoryLabel ?? "Shop"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 888,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 885,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "catalog-heading",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                settings?.store?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: settings.store.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 893,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: categoryLabel ?? "Shop all products"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 895,
                                    columnNumber: 13
                                }, this),
                                settings?.store?.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: settings.store.description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 897,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 891,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "catalog-count",
                            children: [
                                filtered.length,
                                " products"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 900,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 890,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "catalog-toolbar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-pills",
                            children: [
                                {
                                    id: "all",
                                    name: "All products"
                                },
                                ...categories
                            ].map(({ id, name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: filter === id ? "active" : "",
                                    onClick: ()=>setFilter(id),
                                    children: name
                                }, id, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 906,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 903,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "catalog-search",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 917,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    placeholder: "Filter products",
                                    value: query,
                                    onChange: (event)=>setQuery(event.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 918,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 916,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "catalog-sort",
                            children: [
                                "Sort by",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: sortBy,
                                    onChange: (event)=>setSortBy(event.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "featured",
                                            children: "Featured"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 930,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "popular",
                                            children: "Best selling"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 931,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "newest",
                                            children: "Newest arrivals"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 932,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "price-low",
                                            children: "Price: low to high"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 933,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "price-high",
                                            children: "Price: high to low"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 934,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 926,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 924,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 902,
                    columnNumber: 9
                }, this),
                filtered.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "product-grid",
                    children: filtered.map((product, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                            product: product,
                            index: index,
                            settings: settings
                        }, product.id, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 941,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 939,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyProducts, {
                    title: query || filter !== "all" ? "No matching products" : "No products are available right now",
                    description: query || filter !== "all" ? "Try another search term or category." : "Please check back later."
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 950,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 884,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 883,
        columnNumber: 5
    }, this);
}
_s5(CatalogStorefront, "zkpwolc3hoAptJ0sPgW5FgivUI4=");
_c6 = CatalogStorefront;
function EmptyProducts({ title = "No products are available right now", description = "Please check back later." }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "empty-products",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                size: 24
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 977,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 978,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/storefront/Storefront.tsx",
                lineNumber: 979,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 976,
        columnNumber: 5
    }, this);
}
_c7 = EmptyProducts;
function ProductDetailStorefront({ slug, initialProduct, settings, categories = [] }) {
    _s6();
    const product = initialProduct?.product ?? initialProduct;
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const track = useStorefrontTracking(settings);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [variantId, setVariantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(product?.variants?.[0]?.id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetailStorefront.useEffect": ()=>{
            if (product) {
                setVariantId(product.variants?.[0]?.id);
                track("product_view", {
                    contentIds: [
                        product.id
                    ],
                    contentName: product.name,
                    value: product.price
                }, `product-view-${product.id}`);
            }
        }
    }["ProductDetailStorefront.useEffect"], [
        product
    ]);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container state-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Product not found"
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1020,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/products",
                    className: "button button-dark",
                    children: "Back to shop"
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1021,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 1019,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 1018,
        columnNumber: 7
    }, this);
    const variant = product.variants?.find((item)=>item.id === variantId);
    const price = Number(variant?.price ?? product.price) || 0;
    const add = ()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCart"])({
            product,
            quantity,
            variantId
        }));
        track("add_to_cart", {
            contentIds: [
                product.id
            ],
            contentName: product.name,
            value: price * quantity,
            quantity
        }, `detail-add-${product.id}-${variantId ?? "base"}`);
        router.push("/cart");
    };
    const orderNow = ()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCart"])({
            product,
            quantity,
            variantId
        }));
        track("add_to_cart", {
            contentIds: [
                product.id
            ],
            contentName: product.name,
            value: price * quantity,
            quantity
        }, `detail-order-${product.id}-${variantId ?? "base"}`);
        router.push("/checkout");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container product-detail",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "detail-image",
                    children: imageOf(product) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imageOf(product),
                        alt: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 1062,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "detail-letter",
                        children: product.name.slice(0, 1)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                        lineNumber: 1064,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1060,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "detail-copy",
                    children: [
                        categories.find((category)=>category.id === product.categories?.[0])?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "eyebrow",
                            children: categories.find((category)=>category.id === product.categories?.[0])?.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1071,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: product.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1079,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "detail-price",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(price, settings?.store?.currency)
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1080,
                            columnNumber: 11
                        }, this),
                        (product.description || product.shortDescription) && product.description !== "none" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "detail-description",
                            children: product.description || product.shortDescription
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1085,
                            columnNumber: 15
                        }, this),
                        product.variants?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "variant-picker",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Choose an option"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: product.variants.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: variantId === item.id ? "active" : "",
                                            onClick: ()=>setVariantId(item.id),
                                            children: item.name || "Option"
                                        }, item.id, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1094,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1092,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1090,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-buy",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "quantity-control",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "aria-label": "Decrease quantity",
                                            onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: quantity
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1113,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "aria-label": "Increase quantity",
                                            onClick: ()=>setQuantity(quantity + 1),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1118,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1114,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1106,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "detail-actions",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "button button-dark",
                                            onClick: add,
                                            children: [
                                                "Add to cart ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    size: 17
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1123,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1122,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "button button-order",
                                            onClick: orderNow,
                                            children: [
                                                "Order now ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    size: 17
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1125,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1121,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1067,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 1059,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 1058,
        columnNumber: 5
    }, this);
}
_s6(ProductDetailStorefront, "8qKFBK4vFIca2v4RZG6f4r2y41E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useStorefrontTracking
    ];
});
_c8 = ProductDetailStorefront;
function CartStorefront({ settings, categories = [] }) {
    _s7();
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])({
        "CartStorefront.useSelector[items]": (state)=>state.cart.items
    }["CartStorefront.useSelector[items]"]);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const subtotal = items.reduce((total, item)=>total + priceOf(item) * item.quantity, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container cart-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-kicker",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "eyebrow",
                            children: "Your selection"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Shopping bag"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1152,
                    columnNumber: 9
                }, this),
                items.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cart-layout",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cart-items",
                            children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cart-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cart-item-image",
                                            children: imageOf(item.product) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: imageOf(item.product),
                                                alt: ""
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1166,
                                                columnNumber: 23
                                            }, this) : item.product.name.slice(0, 1)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cart-item-main",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/products/${item.product.slug || item.product.id}`,
                                                    children: item.product.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1172,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.variantId ? item.product.variants?.find((variant)=>variant.id === item.variantId)?.name : "Standard"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1177,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "quantity-control",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            "aria-label": "Decrease quantity",
                                                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCartQuantity"])({
                                                                    productId: item.product.id,
                                                                    variantId: item.variantId,
                                                                    quantity: item.quantity - 1
                                                                })),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                                lineNumber: 1197,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                            lineNumber: 1185,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.quantity
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                            lineNumber: 1199,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            "aria-label": "Increase quantity",
                                                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCartQuantity"])({
                                                                    productId: item.product.id,
                                                                    variantId: item.variantId,
                                                                    quantity: item.quantity + 1
                                                                })),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                                lineNumber: 1212,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                            lineNumber: 1200,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1184,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1171,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(priceOf(item) * item.quantity, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1216,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "icon-button",
                                            "aria-label": `Remove ${item.product.name}`,
                                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromCart"])({
                                                    productId: item.product.id,
                                                    variantId: item.variantId
                                                })),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                size: 17
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1234,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1222,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `${item.product.id}-${item.variantId}`, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1160,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "cart-summary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "Order summary"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Subtotal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1242,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(subtotal, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1243,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1241,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Delivery"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1248,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Calculated at checkout"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1249,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cart-total",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1253,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(subtotal, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1254,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1252,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "button button-dark full-width",
                                    href: "/checkout",
                                    children: [
                                        "Continue to checkout ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 17
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1259,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1258,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "text-link clear-cart",
                                    onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearCart"])()),
                                    children: "Clear bag"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1261,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1239,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1157,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-cart",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                            size: 30
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1271,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Your bag is waiting."
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1272,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Add something useful, beautiful, or both."
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1273,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/products",
                            className: "button button-dark",
                            children: "Explore the collection"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1274,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1270,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 1151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 1150,
        columnNumber: 5
    }, this);
}
_s7(CartStorefront, "pGb0aODkcAvlEs1+CzoewPPUhyo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
_c9 = CartStorefront;
function CheckoutStorefront({ initialPaymentMethods, settings, categories = [] }) {
    _s8();
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])({
        "CheckoutStorefront.useSelector[items]": (state)=>state.cart.items
    }["CheckoutStorefront.useSelector[items]"]);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const track = useStorefrontTracking(settings);
    const methods = initialPaymentMethods ?? [];
    const [placeOrder, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlaceOrderMutation"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        address: "",
        zone: "",
        payment: "cod",
        notes: ""
    });
    const { data: deliveryArea } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPublicDeliveryPriceQuery"])();
    const { data: selectedDelivery, isFetching: isLoadingDelivery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPublicDeliveryPriceQuery"])(form.zone, {
        skip: !form.zone
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const subtotal = items.reduce((total, item)=>total + priceOf(item) * item.quantity, 0);
    const deliveryFee = form.zone ? Number(selectedDelivery?.price ?? 0) : Number(deliveryArea?.deliveryCharge ?? deliveryArea?.price ?? 0);
    const total = subtotal + deliveryFee;
    const deliveryZones = deliveryArea?.zones ?? [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutStorefront.useEffect": ()=>{
            if (!form.zone && deliveryZones.length) {
                setForm({
                    "CheckoutStorefront.useEffect": (current)=>({
                            ...current,
                            zone: deliveryZones[0].zone
                        })
                }["CheckoutStorefront.useEffect"]);
            }
        }
    }["CheckoutStorefront.useEffect"], [
        deliveryZones,
        form.zone
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutStorefront.useEffect": ()=>{
            track("checkout_started", {
                value: total,
                contentIds: items.map({
                    "CheckoutStorefront.useEffect": (item)=>item.product.id
                }["CheckoutStorefront.useEffect"])
            }, "storefront-checkout-started");
        }
    }["CheckoutStorefront.useEffect"], []);
    if (!items.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container state-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Your cart is empty"
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1336,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/products",
                    className: "button button-dark",
                    children: "Return to shop"
                }, void 0, false, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1337,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 1335,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 1334,
        columnNumber: 7
    }, this);
    const submit = async (event)=>{
        event.preventDefault();
        if (!form.name || !form.phone || !form.address) {
            setError("Please fill in your name, phone number, and delivery address.");
            return;
        }
        if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim().replace(/[\s-]/g, ""))) {
            setError("Enter a valid Bangladesh mobile number, for example 01712345678.");
            return;
        }
        setError("");
        try {
            const result = await placeOrder({
                items: items.map((item)=>({
                        productId: item.product.id,
                        ...item.variantId ? {
                            variantId: item.variantId
                        } : {},
                        quantity: item.quantity
                    })),
                customer: {
                    name: form.name,
                    phone: form.phone,
                    address: form.address
                },
                notes: form.notes || undefined,
                paymentMethod: form.payment,
                shippingMethod: "standard",
                deliveryZone: form.zone || undefined
            }).unwrap();
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearCart"])());
            router.push(`/thank-you/${result.data?.id || result.id || ""}`);
        } catch  {
            setError("We could not place the order. Please check your details and try again.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StorefrontFrame, {
        settings: settings,
        categories: categories,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "storefront-container checkout-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-kicker",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "eyebrow",
                            children: "Almost yours"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1383,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Complete your order"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1384,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1382,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "checkout-storefront-layout",
                    onSubmit: submit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "checkout-fields-panel",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Full name",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            value: form.name,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    name: event.target.value
                                                }),
                                            placeholder: "Your name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1390,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1388,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Phone number",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            type: "tel",
                                            inputMode: "tel",
                                            value: form.phone,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    phone: event.target.value
                                                }),
                                            placeholder: "01712345678"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1401,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1399,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "wide",
                                    children: [
                                        "Delivery address",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            required: true,
                                            value: form.address,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    address: event.target.value
                                                }),
                                            placeholder: "House, street, area"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1414,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1412,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Delivery area",
                                        deliveryZones.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: form.zone,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    zone: event.target.value
                                                }),
                                            children: deliveryZones.map((zone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: zone.zone,
                                                    children: zone.zone
                                                }, zone.zone, false, {
                                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                    lineNumber: 1433,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1426,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.zone,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    zone: event.target.value
                                                }),
                                            placeholder: "Dhaka, Chattogram, Sylhet..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1439,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1423,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Order note ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "(optional)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1449,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.notes,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    notes: event.target.value
                                                }),
                                            placeholder: "Anything we should know?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1450,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1448,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                    className: "payment-options",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                            children: "Payment method"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1459,
                                            columnNumber: 15
                                        }, this),
                                        (methods.length ? methods : [
                                            {
                                                code: "cod",
                                                name: "Cash on Delivery"
                                            }
                                        ]).filter((method)=>method.isActive !== false).map((method)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: form.payment === method.code ? "selected" : "",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "payment",
                                                        checked: form.payment === method.code,
                                                        onChange: ()=>setForm({
                                                                ...form,
                                                                payment: method.code
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: method.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                                lineNumber: 1479,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                children: method.description || "Pay when your order arrives."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                                lineNumber: 1480,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                        lineNumber: 1478,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, method.code, true, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1466,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1458,
                                    columnNumber: 13
                                }, this),
                                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "form-error",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1487,
                                    columnNumber: 22
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1387,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "checkout-order-summary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "Your order"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1490,
                                    columnNumber: 13
                                }, this),
                                items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "checkout-line",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    item.product.name,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: [
                                                            "× ",
                                                            item.quantity
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                        lineNumber: 1497,
                                                        columnNumber: 39
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1496,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(priceOf(item) * item.quantity, settings?.store?.currency)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/storefront/Storefront.tsx",
                                                lineNumber: 1499,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, `${item.product.id}-${item.variantId}`, true, {
                                        fileName: "[project]/src/components/storefront/Storefront.tsx",
                                        lineNumber: 1492,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1507,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "checkout-line",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Subtotal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1509,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(subtotal, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1510,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1508,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "checkout-line",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Delivery"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1515,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: isLoadingDelivery ? "Checking..." : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(deliveryFee, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1516,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1514,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "checkout-total",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1523,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(total, settings?.store?.currency)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1524,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1522,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: isLoading,
                                    className: "button button-dark full-width",
                                    type: "submit",
                                    children: [
                                        isLoading ? "Placing order..." : "Place order",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 17
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1534,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1528,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "checkout-assurance",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$31$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                                            lineNumber: 1537,
                                            columnNumber: 15
                                        }, this),
                                        " Your information is kept private."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                                    lineNumber: 1536,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/storefront/Storefront.tsx",
                            lineNumber: 1489,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storefront/Storefront.tsx",
                    lineNumber: 1386,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/storefront/Storefront.tsx",
            lineNumber: 1381,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/storefront/Storefront.tsx",
        lineNumber: 1380,
        columnNumber: 5
    }, this);
}
_s8(CheckoutStorefront, "djFxmPjZ48vD2DWRrul9EY1yxfQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useStorefrontTracking,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlaceOrderMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPublicDeliveryPriceQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$publicApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPublicDeliveryPriceQuery"]
    ];
});
_c10 = CheckoutStorefront;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "StorefrontHeader");
__turbopack_context__.k.register(_c1, "StorefrontFooter");
__turbopack_context__.k.register(_c2, "StorefrontFrame");
__turbopack_context__.k.register(_c3, "ProductCard");
__turbopack_context__.k.register(_c4, "HomeStorefront");
__turbopack_context__.k.register(_c5, "HomeBanners");
__turbopack_context__.k.register(_c6, "CatalogStorefront");
__turbopack_context__.k.register(_c7, "EmptyProducts");
__turbopack_context__.k.register(_c8, "ProductDetailStorefront");
__turbopack_context__.k.register(_c9, "CartStorefront");
__turbopack_context__.k.register(_c10, "CheckoutStorefront");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tracking.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeBrowserPixels",
    ()=>initializeBrowserPixels,
    "trackStorefrontEvent",
    ()=>trackStorefrontEvent
]);
const DEDUPE_WINDOW_MS = 60_000;
const STORAGE_PREFIX = "zane-tracking:";
const VISITOR_KEY = `${STORAGE_PREFIX}visitor-id`;
const SESSION_KEY = `${STORAGE_PREFIX}session-id`;
function getDataLayer() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
}
function hasRecentlyFired(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const timestamp = Number(window.sessionStorage.getItem(storageKey));
    if (!timestamp || Date.now() - timestamp >= DEDUPE_WINDOW_MS) {
        window.sessionStorage.removeItem(storageKey);
        return false;
    }
    return true;
}
function markFired(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storageKey = `${STORAGE_PREFIX}${key}`;
    window.sessionStorage.setItem(storageKey, String(Date.now()));
    window.setTimeout(()=>{
        const timestamp = Number(window.sessionStorage.getItem(storageKey));
        if (timestamp && Date.now() - timestamp >= DEDUPE_WINDOW_MS) {
            window.sessionStorage.removeItem(storageKey);
        }
    }, DEDUPE_WINDOW_MS + 100);
}
function getClientId(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const value = crypto.randomUUID();
    window.localStorage.setItem(key, value);
    return value;
}
function getSessionId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const value = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, value);
    return value;
}
function initializeBrowserPixels(options) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const pixelState = window.__zanePixelState ??= {
        facebookInitialized: false,
        tiktokInitialized: false
    };
    if (options.facebookPixelId && !pixelState.facebookInitialized && !window.fbq && !document.getElementById("zane-facebook-pixel-sdk")) {
        const fbq = Object.assign((...args)=>{
            if (fbq.callMethod) fbq.callMethod(...args);
            else fbq.queue?.push(args);
        }, {
            queue: [],
            loaded: true,
            version: "2.0"
        });
        fbq.push = fbq;
        window.fbq = fbq;
        const script = document.createElement("script");
        script.id = "zane-facebook-pixel-sdk";
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(script);
        window.fbq("init", options.facebookPixelId);
        pixelState.facebookInitialized = true;
    }
    if (options.tiktokPixelId && !pixelState.tiktokInitialized && !window.ttq && !document.getElementById("zane-tiktok-pixel-sdk")) {
        const ttq = [];
        ttq.q = [];
        ttq.methods = [
            "page",
            "track",
            "identify",
            "instances",
            "debug",
            "on",
            "off",
            "once",
            "ready",
            "alias",
            "group",
            "enableCookie",
            "disableCookie"
        ];
        ttq._i = {
            [options.tiktokPixelId]: []
        };
        ttq._t = {
            [options.tiktokPixelId]: Date.now()
        };
        ttq._o = {};
        ttq.methods.forEach((method)=>{
            ttq[method] = (...args)=>{
                const call = [
                    method,
                    ...args
                ];
                ttq.q.push(call);
                Array.prototype.push.call(ttq, call);
            };
        });
        ttq.load = (pixelId)=>{
            const script = document.createElement("script");
            script.id = "zane-tiktok-pixel-sdk";
            script.async = true;
            script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
            document.head.appendChild(script);
        };
        window.TiktokAnalyticsObject = "ttq";
        window.ttq = ttq;
        ttq.load?.(options.tiktokPixelId);
        pixelState.tiktokInitialized = true;
    }
}
function dispatchBrowserPixels(event) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const payload = Object.fromEntries(Object.entries(event.payload ?? {}).filter(([key])=>![
            "phone",
            "email",
            "name",
            "address"
        ].includes(key)));
    const eventId = String(payload.event_id ?? event.eventName);
    const facebookEventNames = {
        page_view: "PageView",
        product_view: "ViewContent",
        add_to_cart: "AddToCart",
        checkout_started: "InitiateCheckout",
        purchase: "Purchase"
    };
    const tiktokEventNames = {
        page_view: "Pageview",
        product_view: "ViewContent",
        add_to_cart: "AddToCart",
        checkout_started: "InitiateCheckout",
        purchase: "CompletePayment"
    };
    const facebookEventName = facebookEventNames[event.eventType] ?? event.eventName;
    const tiktokEventName = tiktokEventNames[event.eventType] ?? event.eventName;
    const tiktokPayload = {
        ...getPixelProperties(payload),
        ...Array.isArray(payload.contents) ? {
            contents: payload.contents.map((item)=>{
                const content = item;
                return {
                    ...content.id || content.content_id ? {
                        content_id: content.content_id ?? content.id
                    } : {},
                    ...content.content_name ? {
                        content_name: content.content_name
                    } : {},
                    ...content.quantity != null ? {
                        quantity: Number(content.quantity) || 1
                    } : {},
                    ...content.item_price != null || content.price != null ? {
                        price: Number(content.item_price ?? content.price) || 0
                    } : {}
                };
            })
        } : {},
        event_id: eventId
    };
    const facebookPayload = getPixelProperties(payload);
    if (Array.isArray(payload.contents)) {
        facebookPayload.contents = payload.contents.map((item)=>{
            const content = item;
            return {
                ...content.id || content.content_id ? {
                    id: content.id ?? content.content_id
                } : {},
                ...content.quantity != null ? {
                    quantity: Number(content.quantity) || 1
                } : {},
                ...content.item_price != null ? {
                    item_price: Number(content.item_price) || 0
                } : {}
            };
        });
    }
    if (typeof window.fbq === "function") {
        window.fbq("track", facebookEventName, facebookPayload, {
            eventID: eventId
        });
    }
    if (typeof window.ttq?.track === "function") {
        window.ttq.track(tiktokEventName, tiktokPayload);
    }
}
function getPixelProperties(payload) {
    const allowed = [
        "value",
        "currency",
        "content_ids",
        "content_type",
        "contents",
        "num_items",
        "content_name",
        "order_id"
    ];
    return Object.fromEntries(allowed.filter((key)=>payload[key] !== undefined).map((key)=>[
            key,
            payload[key]
        ]));
}
function standardizePayload(payload = {}) {
    const contentIds = payload.content_ids ?? payload.contentIds;
    const contentType = payload.content_type ?? payload.contentType ?? "product";
    const value = payload.value;
    const currency = payload.currency ?? "BDT";
    const contents = payload.contents ?? (Array.isArray(contentIds) ? contentIds.map((id)=>({
            id,
            content_id: id,
            ...payload.contentName ? {
                content_name: payload.contentName
            } : {},
            quantity: Number(payload.quantity) || 1,
            ...payload.price != null || payload.value != null ? {
                item_price: Number(payload.price ?? payload.value) || 0
            } : {}
        })) : undefined);
    const numItems = payload.num_items ?? (Array.isArray(contents) ? contents.reduce((total, item)=>total + Number(item.quantity ?? 1), 0) : undefined);
    return {
        ...payload,
        ...contentIds ? {
            content_ids: contentIds
        } : {},
        ...contentType ? {
            content_type: contentType
        } : {},
        ...contents ? {
            contents
        } : {},
        ...numItems !== undefined ? {
            num_items: numItems
        } : {},
        ...value !== undefined ? {
            value: Number(value) || 0
        } : {},
        currency
    };
}
function trackStorefrontEvent(event, dedupeKey, send) {
    const eventKey = event.eventType === "add_to_cart" ? `${dedupeKey}-${crypto.randomUUID()}` : dedupeKey;
    if (hasRecentlyFired(eventKey)) return false;
    markFired(eventKey);
    const eventId = String(event.payload?.event_id ?? `${event.eventName}-${eventKey}`);
    const standardPayload = {
        ...standardizePayload(event.payload),
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: event.url ?? (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : window.location.href),
        visitor_id: event.visitorId ?? getClientId(VISITOR_KEY),
        session_id: event.sessionId ?? getSessionId(),
        fbp: typeof document === "undefined" ? undefined : getCookie("_fbp"),
        fbc: typeof document === "undefined" ? undefined : getCookie("_fbc"),
        ttclid: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : new URLSearchParams(window.location.search).get("ttclid") ?? undefined,
        client_user_agent: typeof navigator === "undefined" ? undefined : navigator.userAgent
    };
    const enrichedEvent = {
        ...event,
        payload: standardPayload,
        visitorId: event.visitorId ?? getClientId(VISITOR_KEY),
        sessionId: event.sessionId ?? getSessionId(),
        referrer: event.referrer ?? (typeof document === "undefined" ? undefined : document.referrer)
    };
    getDataLayer().push({
        event: event.eventName,
        eventType: event.eventType,
        ...standardPayload
    });
    dispatchBrowserPixels(enrichedEvent);
    send(enrichedEvent);
    return true;
}
function getCookie(name) {
    const prefix = `${name}=`;
    return document.cookie.split(";").map((cookie)=>cookie.trim()).find((cookie)=>cookie.startsWith(prefix))?.slice(prefix.length);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "debounce",
    ()=>debounce,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "slugify",
    ()=>slugify,
    "truncate",
    ()=>truncate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function formatCurrency(amount, currency) {
    const c = currency || ("TURBOPACK compile-time value", "BDT") || "BDT";
    const formatted = new Intl.NumberFormat("en-BD", {
        maximumFractionDigits: 0
    }).format(amount);
    return c === "BDT" ? `৳${formatted}` : `${c} ${formatted}`;
}
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function formatDateTime(date) {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function truncate(str, length) {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}
function slugify(str) {
    return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function debounce(fn, delay) {
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>fn(...args), delay);
    };
}
function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/publicApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "publicApi",
    ()=>publicApi,
    "useGetLandingPageQuery",
    ()=>useGetLandingPageQuery,
    "useGetPublicCategoriesQuery",
    ()=>useGetPublicCategoriesQuery,
    "useGetPublicDeliveryPriceQuery",
    ()=>useGetPublicDeliveryPriceQuery,
    "useGetPublicOrderQuery",
    ()=>useGetPublicOrderQuery,
    "useGetPublicPaymentMethodsQuery",
    ()=>useGetPublicPaymentMethodsQuery,
    "useGetPublicProductQuery",
    ()=>useGetPublicProductQuery,
    "useGetPublicProductsQuery",
    ()=>useGetPublicProductsQuery,
    "useGetPublicSettingsQuery",
    ()=>useGetPublicSettingsQuery,
    "usePlaceOrderMutation",
    ()=>usePlaceOrderMutation,
    "useSubmitContactMutation",
    ()=>useSubmitContactMutation,
    "useSubscribeNewsletterMutation",
    ()=>useSubscribeNewsletterMutation,
    "useTrackAnalyticsEventMutation",
    ()=>useTrackAnalyticsEventMutation,
    "useTrackPageViewMutation",
    ()=>useTrackPageViewMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/api.ts [app-client] (ecmascript)");
;
const publicApi = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].injectEndpoints({
    endpoints: (builder)=>({
            getPublicCategories: builder.query({
                query: ()=>"/public/v1/categories",
                transformResponse: (response)=>response?.data?.data ?? response?.data ?? response ?? []
            }),
            getPublicProducts: builder.query({
                query: (params)=>({
                        url: "/public/v1/products",
                        params: params ?? {}
                    }),
                transformResponse: (response)=>response?.data ?? response
            }),
            getPublicProduct: builder.query({
                query: (slug)=>`/public/v1/products/${encodeURIComponent(slug)}`,
                transformResponse: (response)=>response?.data ?? response
            }),
            getPublicPaymentMethods: builder.query({
                query: ()=>"/public/v1/payment-methods",
                transformResponse: (response)=>response?.data ?? response ?? []
            }),
            getPublicDeliveryPrice: builder.query({
                query: (zone)=>({
                        url: "/public/v1/delivery-prices",
                        params: zone ? {
                            zone
                        } : undefined
                    }),
                transformResponse: (response)=>response?.data ?? response
            }),
            placeOrder: builder.mutation({
                query: (data)=>({
                        url: "/public/v1/orders",
                        method: "POST",
                        body: data
                    })
            }),
            getPublicOrder: builder.query({
                query: (id)=>`/public/v1/orders/${encodeURIComponent(id)}`,
                transformResponse: (response)=>response?.data ?? response
            }),
            subscribeNewsletter: builder.mutation({
                query: (email)=>({
                        url: "/public/newsletter",
                        method: "POST",
                        body: {
                            email
                        }
                    })
            }),
            submitContact: builder.mutation({
                query: (data)=>({
                        url: "/public/contact",
                        method: "POST",
                        body: data
                    })
            }),
            getLandingPage: builder.query({
                query: (slug)=>`/public/v1/landing-pages/${encodeURIComponent(slug)}`,
                transformResponse: (response)=>response?.data ?? response
            }),
            getPublicSettings: builder.query({
                query: ()=>"/public/v1/settings",
                transformResponse: (response)=>response?.data ?? response ?? {}
            }),
            trackPageView: builder.mutation({
                query: (visitorId)=>({
                        url: "/public/v1/tracking",
                        method: "GET",
                        params: visitorId ? {
                            visitorId
                        } : undefined
                    })
            }),
            trackAnalyticsEvent: builder.mutation({
                query: (data)=>({
                        url: "/public/v1/tracking",
                        method: "POST",
                        body: data
                    })
            })
        })
});
const { useGetPublicProductsQuery, useGetPublicCategoriesQuery, useGetPublicProductQuery, useGetPublicPaymentMethodsQuery, useGetPublicDeliveryPriceQuery, usePlaceOrderMutation, useGetPublicOrderQuery, useTrackPageViewMutation, useTrackAnalyticsEventMutation, useSubscribeNewsletterMutation, useSubmitContactMutation, useGetLandingPageQuery, useGetPublicSettingsQuery } = publicApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0hc678x._.js.map