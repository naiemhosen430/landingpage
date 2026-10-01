(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/providers/StoreProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-redux@9.3.0_@types+re_d2337efa717268ab182fc448083bb9fa/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartSlice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function CartHydrator() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartHydrator.useEffect": ()=>{
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hydrateCart"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadCartItems"])()));
        }
    }["CartHydrator.useEffect"], [
        dispatch
    ]);
    return null;
}
_s(CartHydrator, "rAh3tY+Iv6hWC9AI4Dm+rCbkwNE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
_c = CartHydrator;
function StoreProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$3$2e$0_$40$types$2b$re_d2337efa717268ab182fc448083bb9fa$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartHydrator, {}, void 0, false, {
                fileName: "[project]/src/providers/StoreProvider.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/providers/StoreProvider.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c1 = StoreProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "CartHydrator");
__turbopack_context__.k.register(_c1, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$0_$40$types$2b$node$40$20$2e$_ab617c3b1931a0c19e3c6de19eb34611$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.0_@types+node@20._ab617c3b1931a0c19e3c6de19eb34611/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
;
const baseQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
    baseUrl: ("TURBOPACK compile-time value", "http://localhost:3001/api"),
    prepareHeaders: (headers, { getState, endpoint })=>{
        const token = getState().auth.token;
        const projectId = ("TURBOPACK compile-time value", "6a8f13fbb9c5d9eb2aab3730");
        const projectKey = ("TURBOPACK compile-time value", "pk_04484504295230ad918d5a3270d3ef77bdb60c77f194fa12b3f99ec3e2d6c65a");
        if (!endpoint.startsWith("getStorageUsage") && !endpoint.startsWith("listStorageModule") && !endpoint.startsWith("deleteStorageRecords")) {
            headers.set("x-project-id", projectId || "");
            headers.set("x-project-key", projectKey || "");
        }
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});
let refreshPromise = null;
const baseQueryWithReauth = async (args, api, extraOptions)=>{
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error && result.error.status === 401) {
        const refreshToken = api.getState().auth.refreshToken;
        if (!refreshToken) {
            api.dispatch({
                type: "auth/logout"
            });
            return result;
        }
        refreshPromise ??= (async ()=>{
            const refreshResult = await baseQuery({
                url: "/auth/refresh",
                method: "POST",
                body: {
                    refreshToken
                }
            }, api, extraOptions);
            const hasData = refreshResult && refreshResult.data !== undefined;
            if (!hasData) return null;
            const refreshData = refreshResult.data?.data ?? refreshResult.data ?? refreshResult;
            const tokens = refreshData.tokens ?? refreshData;
            const accessToken = tokens?.accessToken ?? tokens?.token;
            if (!accessToken) return null;
            const nextRefreshToken = tokens?.refreshToken ?? refreshToken;
            api.dispatch({
                type: "auth/setTokens",
                payload: {
                    token: accessToken,
                    refreshToken: nextRefreshToken
                }
            });
            if (refreshData.user) {
                api.dispatch({
                    type: "auth/setCredentials",
                    payload: {
                        user: refreshData.user,
                        token: accessToken,
                        refreshToken: nextRefreshToken
                    }
                });
            }
            return accessToken;
        })().finally(()=>{
            refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        if (accessToken) {
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch({
                type: "auth/logout"
            });
        }
    }
    return result;
};
const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Dashboard",
        "Products",
        "Product",
        "Orders",
        "Order",
        "Settings",
        "Media",
        "Profile",
        "Analytics",
        "Courier",
        "Package",
        "LandingPage",
        "LandingPages",
        "Category",
        "Categories",
        "DeliveryAreas",
        "DeliveryArea",
        "PaymentMethods",
        "TrackingEvents",
        "TrackingEvent",
        "Storage",
        "HomePage"
    ],
    endpoints: ()=>({})
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/authSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "logout",
    ()=>logout,
    "setCredentials",
    ()=>setCredentials,
    "setTokens",
    ()=>setTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken ?? null;
            state.isAuthenticated = true;
        },
        setTokens: (state, action)=>{
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
            state.isAuthenticated = Boolean(action.payload.token);
        },
        logout: (state)=>{
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        }
    }
});
const { setCredentials, setTokens, logout } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/authStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthState",
    ()=>clearAuthState,
    "loadAuthState",
    ()=>loadAuthState,
    "saveAuthState",
    ()=>saveAuthState
]);
const AUTH_STORAGE_KEY = "zanestore_auth";
function loadAuthState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return {
            user: parsed.user ?? null,
            token: parsed.token ?? null,
            refreshToken: parsed.refreshToken ?? null,
            isAuthenticated: !!parsed.token
        };
    } catch (error) {
        console.error("Failed to load auth state", error);
        return {};
    }
}
function saveAuthState(state) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        if (!state.token) {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
            return;
        }
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated
        }));
    } catch (error) {
        console.error("Failed to save auth state", error);
    }
}
function clearAuthState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear auth state", error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/cartSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CART_STORAGE_KEY",
    ()=>CART_STORAGE_KEY,
    "addToCart",
    ()=>addToCart,
    "clearCart",
    ()=>clearCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "hydrateCart",
    ()=>hydrateCart,
    "loadCartItems",
    ()=>loadCartItems,
    "removeFromCart",
    ()=>removeFromCart,
    "updateCartQuantity",
    ()=>updateCartQuantity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const CART_STORAGE_KEY = "storefront-cart";
function loadCartItems() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const value = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed = value ? JSON.parse(value) : null;
        return parsed && Array.isArray(parsed.items) ? parsed.items : [];
    } catch  {
        return [];
    }
}
const initialState = {
    items: [],
    hydrated: false
};
const cartSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "cart",
    initialState,
    reducers: {
        hydrateCart: (state, action)=>{
            state.items = action.payload;
            state.hydrated = true;
        },
        addToCart: (state, action)=>{
            const { product, quantity = 1, variantId } = action.payload;
            const existing = state.items.find((item)=>item.product.id === product.id && item.variantId === variantId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({
                    product,
                    quantity,
                    variantId
                });
            }
        },
        updateCartQuantity: (state, action)=>{
            const item = state.items.find((entry)=>entry.product.id === action.payload.productId && entry.variantId === action.payload.variantId);
            if (!item) return;
            if (action.payload.quantity <= 0) {
                state.items = state.items.filter((entry)=>entry !== item);
            } else {
                item.quantity = action.payload.quantity;
            }
        },
        removeFromCart: (state, action)=>{
            state.items = state.items.filter((item)=>item.product.id !== action.payload.productId || item.variantId !== action.payload.variantId);
        },
        clearCart: (state)=>{
            state.items = [];
        }
    }
});
const { hydrateCart, addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
const __TURBOPACK__default__export__ = cartSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@reduxjs+toolkit@2.12.0_rea_9d078e1e7ed1432f613e0157c1af3fd8/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartSlice.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const preloadedState = {
    // loadAuthState may return a partial object; cast to any so it can be used safely
    auth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadAuthState"])()
};
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].reducer,
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        cart: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    },
    middleware: (getDefaultMiddleware)=>// api.middleware may have incompatible tuple typing in some setups; cast to any
        getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].middleware),
    preloadedState
});
store.subscribe(()=>{
    const state = store.getState();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAuthState"])(state.auth);
    if (("TURBOPACK compile-time value", "object") !== "undefined" && state.cart.hydrated) {
        try {
            window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CART_STORAGE_KEY"], JSON.stringify(state.cart));
        } catch  {
        // Keep in-memory cart behavior when browser storage is unavailable.
        }
    }
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$12$2e$0_rea_9d078e1e7ed1432f613e0157c1af3fd8$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupListeners"])(store.dispatch);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_16pwe_b._.js.map