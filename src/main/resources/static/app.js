(function () {
    var useEffect = React.useEffect;
    var useState = React.useState;
    var e = React.createElement;
    var SESSION_KEY = "you-bank-session";

    function currency(value) {
        var number = Number(value || 0);
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(number);
    }

    function title(text) {
        return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
    }

    function readSession() {
        try {
            var raw = window.localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function writeSession(session) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function clearSession() {
        window.localStorage.removeItem(SESSION_KEY);
    }

    function getRoute() {
        var hash = window.location.hash.replace(/^#/, "");
        return hash || "/login";
    }

    function setRoute(route) {
        window.location.hash = route;
    }

    function api(path, options, session) {
        var headers = Object.assign({
            "Content-Type": "application/json"
        }, options && options.headers ? options.headers : {});

        if (session && session.token) {
            headers.Authorization = "Bearer " + session.token;
        }

        return fetch(path, Object.assign({}, options || {}, { headers: headers })).then(function (response) {
            return response.text().then(function (text) {
                var payload = text ? JSON.parse(text) : {};
                if (!response.ok) {
                    throw new Error(payload.message || "Request failed");
                }
                return payload;
            });
        });
    }

    function Field(props) {
        return e("label", { className: "field" }, [
            e("span", { key: "label" }, props.label),
            props.type === "select"
                ? e("select", {
                    key: "input",
                    value: props.value,
                    onChange: function (event) { props.onChange(event.target.value); }
                }, props.options.map(function (option) {
                    return e("option", { key: option.value, value: option.value }, option.label);
                }))
                : e("input", {
                    key: "input",
                    type: props.type || "text",
                    value: props.value,
                    min: props.min,
                    placeholder: props.placeholder || "",
                    onChange: function (event) { props.onChange(event.target.value); }
                })
        ]);
    }

    function Banner(props) {
        if (!props.message) {
            return null;
        }
        return e("div", { className: "banner " + (props.kind === "error" ? "banner-error" : "banner-success") }, props.message);
    }

    function Pagination(props) {
        return e("div", { className: "pagination" }, [
            e("button", {
                key: "prev",
                className: "button button-soft",
                disabled: props.page <= 0 || props.loading,
                onClick: function () { props.onChange(props.page - 1); }
            }, "Previous"),
            e("div", { key: "meta", className: "pagination-meta" },
                "Page " + (props.page + 1) + " of " + Math.max(props.totalPages || 1, 1)
            ),
            e("button", {
                key: "next",
                className: "button button-soft",
                disabled: props.last || props.loading,
                onClick: function () { props.onChange(props.page + 1); }
            }, "Next")
        ]);
    }

    function AuthLayout(props) {
        return e("div", { className: "auth-shell" }, [
            e("section", { key: "brand", className: "auth-brand" }, [
                e("div", { className: "auth-chip mono" }, "You Bank Digital Banking"),
                e("h1", null, "Secure everyday banking for accounts, transfers, and balance control."),
                e("p", null, "Sign in to review balances, monitor account activity, move funds, and manage customer accounts through a cleaner digital banking experience."),
                e("div", { className: "auth-highlights" }, [
                    e("div", { key: "one", className: "auth-highlight" }, [
                        e("strong", null, "Live Summary"),
                        e("span", null, "Portfolio health and premium account metrics.")
                    ]),
                    e("div", { key: "two", className: "auth-highlight" }, [
                        e("strong", null, "Paginated Accounts"),
                        e("span", null, "Review account lists and transactions without loading everything at once.")
                    ]),
                    e("div", { key: "three", className: "auth-highlight" }, [
                        e("strong", null, "Payments Desk"),
                        e("span", null, "Deposit, withdraw, and transfer from a dedicated workflow page.")
                    ])
                ])
            ]),
            e("section", { key: "card", className: "auth-card" }, props.children)
        ]);
    }

    function LoginPage(props) {
        return e(AuthLayout, null, [
            e("div", { key: "header", className: "auth-card-head" }, [
                e("h2", null, "Log in"),
                e("p", null, "Access your digital banking profile.")
            ]),
            e(Banner, { key: "banner", kind: props.bannerKind, message: props.banner }),
            e("div", { key: "fields", className: "form-grid" }, [
                e(Field, {
                    key: "email",
                    label: "Email",
                    type: "email",
                    value: props.form.email,
                    onChange: function (value) { props.setForm("email", value); },
                    placeholder: "you@example.com"
                }),
                e(Field, {
                    key: "password",
                    label: "Password",
                    type: "password",
                    value: props.form.password,
                    onChange: function (value) { props.setForm("password", value); },
                    placeholder: "password123"
                })
            ]),
            e("div", { key: "actions", className: "auth-actions" }, [
                e("button", {
                    key: "submit",
                    className: "button button-primary button-block",
                    onClick: props.onSubmit,
                    disabled: props.loading
                }, props.loading ? "Signing in..." : "Access account"),
                e("button", {
                    key: "switch",
                    className: "button button-link button-block",
                    onClick: function () { setRoute("/signup"); }
                }, "Need an account? Sign up")
            ]),
            e("div", { key: "hint", className: "demo-hint mono" }, "Quick access: demo@youbank.com / password123")
        ]);
    }

    function SignupPage(props) {
        return e(AuthLayout, null, [
            e("div", { key: "header", className: "auth-card-head" }, [
                e("h2", null, "Create profile"),
                e("p", null, "Register a new digital banking profile.")
            ]),
            e(Banner, { key: "banner", kind: props.bannerKind, message: props.banner }),
            e("div", { key: "fields", className: "form-grid" }, [
                e(Field, {
                    key: "name",
                    label: "Full name",
                    value: props.form.fullName,
                    onChange: function (value) { props.setForm("fullName", value); },
                    placeholder: "Saurav Sharma"
                }),
                e(Field, {
                    key: "email",
                    label: "Email",
                    type: "email",
                    value: props.form.email,
                    onChange: function (value) { props.setForm("email", value); },
                    placeholder: "saurav@youbank.com"
                }),
                e(Field, {
                    key: "password",
                    label: "Password",
                    type: "password",
                    value: props.form.password,
                    onChange: function (value) { props.setForm("password", value); },
                    placeholder: "At least 6 characters"
                })
            ]),
            e("div", { key: "actions", className: "auth-actions" }, [
                e("button", {
                    key: "submit",
                    className: "button button-primary button-block",
                    onClick: props.onSubmit,
                    disabled: props.loading
                }, props.loading ? "Creating..." : "Create account"),
                e("button", {
                    key: "switch",
                    className: "button button-link button-block",
                    onClick: function () { setRoute("/login"); }
                }, "Already have an account? Log in")
            ])
        ]);
    }

    function Shell(props) {
        var navItems = [
            { route: "/dashboard", label: "Dashboard" },
            { route: "/accounts", label: "Accounts" },
            { route: "/payments", label: "Payments" }
        ];

        return e("div", { className: "bank-shell" }, [
            e("aside", { key: "sidebar", className: "sidebar" }, [
                e("div", { key: "brand", className: "brand-block" }, [
                    e("div", { className: "brand-mark" }, "YB"),
                    e("div", null, [
                        e("strong", null, "You Bank"),
                        e("span", { className: "muted" }, "Digital banking")
                    ])
                ]),
                e("nav", { key: "nav", className: "sidebar-nav" },
                    navItems.map(function (item) {
                        return e("button", {
                            key: item.route,
                            className: "nav-link" + (props.route === item.route ? " nav-link-active" : ""),
                            onClick: function () { setRoute(item.route); }
                        }, item.label);
                    })
                ),
                e("div", { key: "profile", className: "sidebar-profile" }, [
                    e("span", { className: "eyebrow" }, "Signed in"),
                    e("strong", null, props.session.fullName),
                    e("div", { className: "muted mono" }, props.session.email),
                    e("button", {
                        className: "button button-soft button-block",
                        onClick: props.onLogout
                    }, "Log out")
                ])
            ]),
            e("div", { key: "content", className: "content-shell" }, [
                e("header", { key: "top", className: "topbar" }, [
                    e("div", null, [
                        e("span", { className: "eyebrow mono" }, "Retail Banking"),
                        e("h1", null, props.heading)
                    ]),
                    e("div", { className: "topbar-card" }, [
                        e("span", null, "Signed in as"),
                        e("strong", null, props.session.fullName)
                    ])
                ]),
                e(Banner, { key: "banner", kind: props.bannerKind, message: props.banner }),
                e("main", { key: "main", className: "page-body" }, props.children)
            ])
        ]);
    }

    function DashboardPage(props) {
        var summary = props.summary || { totalAccounts: 0, totalBalance: 0, averageBalance: 0, accountsByType: {}, premiumOwners: [] };
        return e("div", { className: "page-grid" }, [
            e("section", { key: "hero", className: "hero-panel" }, [
                e("div", { className: "hero-copy" }, [
                    e("span", { className: "eyebrow mono" }, "Overview"),
                    e("h2", null, "Stay close to balances, account growth, and day-to-day money movement."),
                    e("p", null, "Review core banking metrics, open account details, and move directly into account servicing or payments.")
                ]),
                e("div", { className: "stat-grid" }, [
                    e("article", { key: "balance", className: "stat-card" }, [
                        e("span", null, "Total balance"),
                        e("strong", null, currency(summary.totalBalance))
                    ]),
                    e("article", { key: "accounts", className: "stat-card" }, [
                        e("span", null, "Total accounts"),
                        e("strong", null, summary.totalAccounts || 0)
                    ]),
                    e("article", { key: "average", className: "stat-card" }, [
                        e("span", null, "Average balance"),
                        e("strong", null, currency(summary.averageBalance))
                    ])
                ])
            ]),
            e("section", { key: "types", className: "card" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Account mix"),
                    e("button", { className: "button button-soft", onClick: props.onRefresh, disabled: props.loading }, "Refresh")
                ]),
                e("div", { className: "metric-list" },
                    Object.entries(summary.accountsByType || {}).map(function (entry) {
                        return e("div", { key: entry[0], className: "metric-row" }, [
                            e("span", null, title(entry[0])),
                            e("strong", null, entry[1])
                        ]);
                    })
                )
            ]),
            e("section", { key: "accounts", className: "card card-wide" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Recent accounts"),
                    e("button", { className: "button button-soft", onClick: function () { setRoute("/accounts"); } }, "View accounts")
                ]),
                e("div", { className: "account-preview-grid" },
                    props.accounts.map(function (account) {
                        return e("article", { key: account.id, className: "account-preview" }, [
                            e("div", { className: "account-preview-top" }, [
                                e("div", null, [
                                    e("strong", null, account.ownerName),
                                    e("div", { className: "muted" }, title(account.accountType))
                                ]),
                                e("strong", { className: "mono" }, currency(account.balance))
                            ]),
                            e("div", { className: "muted mono" }, account.id),
                            e("div", { className: "badge-row" },
                                (account.tags || []).map(function (tag, index) {
                                    return e("span", { key: tag + index, className: "badge" }, tag);
                                })
                            )
                        ]);
                    })
                )
            ]),
            e("section", { key: "premium", className: "card" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Priority relationships"),
                    e("button", { className: "button button-soft", onClick: function () { setRoute("/payments"); } }, "Open payments")
                ]),
                props.summary.premiumOwners && props.summary.premiumOwners.length
                    ? e("div", { className: "premium-list" },
                        props.summary.premiumOwners.map(function (owner, index) {
                            return e("div", { key: owner + index, className: "premium-item" }, owner);
                        })
                    )
                    : e("p", { className: "muted" }, "No premium accounts currently cross the configured threshold.")
            ])
        ]);
    }

    function AccountsPage(props) {
        var selected = props.selectedAccount;
        return e("div", { className: "page-grid page-grid-wide" }, [
            e("section", { key: "list", className: "card card-wide" }, [
                e("div", { className: "section-head" }, [
                    e("div", null, [
                        e("h3", null, "Accounts"),
                        e("p", { className: "muted" }, "Browse customer accounts and review balances with paginated access.")
                    ]),
                    e("button", { className: "button button-soft", onClick: props.onRefresh, disabled: props.loading }, "Reload")
                ]),
                e("div", { className: "account-list-grid" },
                    props.accounts.map(function (account) {
                        return e("article", {
                            key: account.id,
                            className: "account-tile" + (selected && selected.id === account.id ? " account-tile-active" : ""),
                            onClick: function () { props.onSelect(account.id); }
                        }, [
                            e("div", { className: "account-preview-top" }, [
                                e("div", null, [
                                    e("strong", null, account.ownerName),
                                    e("div", { className: "muted" }, title(account.accountType))
                                ]),
                                e("strong", { className: "mono" }, currency(account.balance))
                            ]),
                            e("div", { className: "muted mono" }, account.id),
                            e("div", { className: "muted" }, account.transactionCount + " transactions")
                        ]);
                    })
                ),
                e(Pagination, {
                    page: props.page,
                    totalPages: props.totalPages,
                    last: props.last,
                    loading: props.loading,
                    onChange: props.onPageChange
                })
            ]),
            e("section", { key: "detail", className: "card detail-card" },
                selected
                    ? [
                        e("div", { key: "head", className: "section-head" }, [
                            e("div", null, [
                                e("h3", null, selected.ownerName),
                                e("div", { className: "muted" }, title(selected.accountType))
                            ]),
                            e("strong", { className: "mono detail-balance" }, currency(selected.balance))
                        ]),
                        e("div", { key: "meta", className: "detail-meta" },
                            Object.entries(selected.metadata || {}).map(function (entry) {
                                return e("div", { key: entry[0], className: "metric-row" }, [
                                    e("span", null, entry[0]),
                                    e("strong", null, entry[1])
                                ]);
                            })
                        ),
                        e("div", { key: "activity-head", className: "section-head section-head-tight" }, [
                            e("h4", null, "Transaction history"),
                            e("span", { className: "muted" }, "Paged activity view")
                        ]),
                        e("div", { key: "transactions", className: "transaction-list" },
                            (props.transactions || []).map(function (transaction) {
                                return e("div", { key: transaction.id, className: "transaction-row" }, [
                                    e("div", null, [
                                        e("strong", null, title(transaction.type.replace(/_/g, " "))),
                                        e("div", { className: "muted" }, transaction.description)
                                    ]),
                                    e("strong", { className: "mono" }, currency(transaction.amount))
                                ]);
                            })
                        ),
                        e(Pagination, {
                            key: "pager",
                            page: props.transactionPage,
                            totalPages: props.transactionTotalPages,
                            last: props.transactionLast,
                            loading: props.loading,
                            onChange: props.onTransactionPageChange
                        })
                    ]
                    : e("div", { className: "empty-state" }, [
                        e("h3", null, "Select an account"),
                        e("p", null, "Choose an account to review profile details and transaction history.")
                    ])
            )
        ]);
    }

    function PaymentsPage(props) {
        return e("div", { className: "page-grid" }, [
            e("section", { key: "create", className: "card" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Open account"),
                    e("span", { className: "muted" }, "Create a new customer account")
                ]),
                e("div", { className: "form-grid" }, [
                    e(Field, {
                        key: "owner",
                        label: "Owner name",
                        value: props.createForm.ownerName,
                        onChange: function (value) { props.setCreateField("ownerName", value); },
                        placeholder: "Katherine Johnson"
                    }),
                    e(Field, {
                        key: "type",
                        label: "Account type",
                        type: "select",
                        value: props.createForm.accountType,
                        onChange: function (value) { props.setCreateField("accountType", value); },
                        options: props.accountTypeOptions
                    }),
                    e(Field, {
                        key: "opening",
                        label: "Opening balance",
                        type: "number",
                        min: "0",
                        value: props.createForm.openingBalance,
                        onChange: function (value) { props.setCreateField("openingBalance", value); },
                        placeholder: "2500"
                    })
                ]),
                e("button", {
                    className: "button button-primary button-block",
                    onClick: props.onCreate,
                    disabled: props.loading
                }, props.loading ? "Creating..." : "Open account")
            ]),
            e("section", { key: "funds", className: "card" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Cash movement"),
                    e("span", { className: "muted" }, "Deposit or withdraw against a single account")
                ]),
                e("div", { className: "form-grid" }, [
                    e(Field, {
                        key: "account",
                        label: "Account",
                        type: "select",
                        value: props.actionForm.accountId,
                        onChange: function (value) { props.setActionField("accountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        key: "amount",
                        label: "Amount",
                        type: "number",
                        min: "0.01",
                        value: props.actionForm.amount,
                        onChange: function (value) { props.setActionField("amount", value); },
                        placeholder: "500"
                    }),
                    e(Field, {
                        key: "desc",
                        label: "Description",
                        value: props.actionForm.description,
                        onChange: function (value) { props.setActionField("description", value); },
                        placeholder: "Branch cash deposit"
                    })
                ]),
                e("div", { className: "button-row" }, [
                    e("button", {
                        key: "deposit",
                        className: "button button-primary",
                        onClick: function () { props.onAmountAction("deposit"); },
                        disabled: props.loading || !props.accountOptions.length
                    }, "Deposit"),
                    e("button", {
                        key: "withdraw",
                        className: "button button-soft",
                        onClick: function () { props.onAmountAction("withdraw"); },
                        disabled: props.loading || !props.accountOptions.length
                    }, "Withdraw")
                ])
            ]),
            e("section", { key: "transfer", className: "card card-wide" }, [
                e("div", { className: "section-head" }, [
                    e("h3", null, "Transfer funds"),
                    e("span", { className: "muted" }, "Move funds between bank accounts")
                ]),
                e("div", { className: "form-grid form-grid-4" }, [
                    e(Field, {
                        key: "source",
                        label: "Source",
                        type: "select",
                        value: props.transferForm.sourceAccountId,
                        onChange: function (value) { props.setTransferField("sourceAccountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        key: "target",
                        label: "Target",
                        type: "select",
                        value: props.transferForm.targetAccountId,
                        onChange: function (value) { props.setTransferField("targetAccountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        key: "amount",
                        label: "Amount",
                        type: "number",
                        min: "0.01",
                        value: props.transferForm.amount,
                        onChange: function (value) { props.setTransferField("amount", value); },
                        placeholder: "1200"
                    }),
                    e(Field, {
                        key: "description",
                        label: "Transfer note",
                        value: props.transferForm.description,
                        onChange: function (value) { props.setTransferField("description", value); },
                        placeholder: "Quarterly reserve move"
                    })
                ]),
                e("button", {
                    className: "button button-accent",
                    onClick: props.onTransfer,
                    disabled: props.loading || !props.accountOptions.length
                }, props.loading ? "Processing..." : "Transfer funds")
            ])
        ]);
    }

    function App() {
        var [route, setRouteState] = useState(getRoute());
        var [session, setSession] = useState(readSession());
        var [banner, setBanner] = useState({ kind: "success", text: "" });
        var [loading, setLoading] = useState(false);

        var [loginForm, setLoginForm] = useState({ email: "demo@youbank.com", password: "password123" });
        var [signupForm, setSignupForm] = useState({ fullName: "", email: "", password: "" });

        var [summary, setSummary] = useState({ totalAccounts: 0, totalBalance: 0, averageBalance: 0, accountsByType: {}, premiumOwners: [] });
        var [dashboardAccounts, setDashboardAccounts] = useState([]);
        var [accountPage, setAccountPage] = useState({ content: [], page: 0, totalPages: 1, last: true });
        var [selectedAccount, setSelectedAccount] = useState(null);
        var [transactionPage, setTransactionPage] = useState({ content: [], page: 0, totalPages: 1, last: true });

        var [createForm, setCreateForm] = useState({ ownerName: "", accountType: "CHECKING", openingBalance: "0" });
        var [actionForm, setActionFormState] = useState({ accountId: "", amount: "", description: "" });
        var [transferForm, setTransferFormState] = useState({ sourceAccountId: "", targetAccountId: "", amount: "", description: "" });
        var [accountOptions, setAccountOptions] = useState([]);

        useEffect(function () {
            function onHashChange() {
                setRouteState(getRoute());
            }
            window.addEventListener("hashchange", onHashChange);
            return function () {
                window.removeEventListener("hashchange", onHashChange);
            };
        }, []);

        useEffect(function () {
            if (session && (route === "/login" || route === "/signup" || route === "/")) {
                setRoute("/dashboard");
            }
            if (!session && route !== "/login" && route !== "/signup") {
                setRoute("/login");
            }
        }, [session, route]);

        useEffect(function () {
            if (session) {
                loadDashboard(true);
                loadAccountsPage(0, true);
                loadAccountOptions(true);
            }
        }, [session]);

        function flash(kind, text) {
            setBanner({ kind: kind, text: text });
        }

        function setLoginField(field, value) {
            setLoginForm(function (prev) {
                var next = Object.assign({}, prev);
                next[field] = value;
                return next;
            });
        }

        function setSignupField(field, value) {
            setSignupForm(function (prev) {
                var next = Object.assign({}, prev);
                next[field] = value;
                return next;
            });
        }

        function setCreateField(field, value) {
            setCreateForm(function (prev) {
                var next = Object.assign({}, prev);
                next[field] = value;
                return next;
            });
        }

        function setActionField(field, value) {
            setActionFormState(function (prev) {
                var next = Object.assign({}, prev);
                next[field] = value;
                return next;
            });
        }

        function setTransferField(field, value) {
            setTransferFormState(function (prev) {
                var next = Object.assign({}, prev);
                next[field] = value;
                return next;
            });
        }

        function normalizeSelectors(items) {
            var options = items.map(function (account) {
                return {
                    value: account.id,
                    label: account.ownerName + " - " + title(account.accountType) + " - " + currency(account.balance)
                };
            });
            setAccountOptions(options);
            if (options.length) {
                setActionFormState(function (prev) {
                    return Object.assign({}, prev, { accountId: prev.accountId || options[0].value });
                });
                setTransferFormState(function (prev) {
                    return Object.assign({}, prev, {
                        sourceAccountId: prev.sourceAccountId || options[0].value,
                        targetAccountId: prev.targetAccountId || options[Math.min(1, options.length - 1)].value
                    });
                });
            }
        }

        function loadDashboard(silent) {
            if (!silent) {
                setLoading(true);
            }
            return Promise.all([
                api("/api/accounts/summary", null, session),
                api("/api/accounts?page=0&size=4", null, session)
            ]).then(function (results) {
                setSummary(results[0]);
                setDashboardAccounts(results[1].content || []);
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                if (!silent) {
                    setLoading(false);
                }
            });
        }

        function loadAccountOptions(silent) {
            if (!silent) {
                setLoading(true);
            }
            return api("/api/accounts?page=0&size=100", null, session).then(function (result) {
                normalizeSelectors(result.content || []);
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                if (!silent) {
                    setLoading(false);
                }
            });
        }

        function loadAccountsPage(page, silent) {
            if (!silent) {
                setLoading(true);
            }
            return api("/api/accounts?page=" + page + "&size=6", null, session).then(function (result) {
                setAccountPage(result);
                if (result.content && result.content.length) {
                    var firstSelection = selectedAccount && result.content.some(function (item) { return item.id === selectedAccount.id; })
                        ? selectedAccount.id
                        : result.content[0].id;
                    return loadAccountDetail(firstSelection, 0, true);
                }
                setSelectedAccount(null);
                setTransactionPage({ content: [], page: 0, totalPages: 1, last: true });
                return null;
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                if (!silent) {
                    setLoading(false);
                }
            });
        }

        function loadAccountDetail(accountId, txPage, silent) {
            if (!silent) {
                setLoading(true);
            }
            return Promise.all([
                api("/api/accounts/" + accountId, null, session),
                api("/api/accounts/" + accountId + "/transactions?page=" + txPage + "&size=5", null, session)
            ]).then(function (results) {
                setSelectedAccount(results[0]);
                setTransactionPage(results[1]);
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                if (!silent) {
                    setLoading(false);
                }
            });
        }

        function afterMutation(message) {
            return Promise.all([
                loadDashboard(true),
                loadAccountsPage(accountPage.page || 0, true),
                loadAccountOptions(true)
            ]).then(function () {
                flash("success", message);
            });
        }

        function login() {
            setLoading(true);
            api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(loginForm)
            }).then(function (result) {
                writeSession(result);
                setSession(result);
                flash("success", "Signed in successfully.");
                setRoute("/dashboard");
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function signup() {
            setLoading(true);
            api("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(signupForm)
            }).then(function (result) {
                writeSession(result);
                setSession(result);
                flash("success", "Profile created. Welcome to You Bank.");
                setRoute("/dashboard");
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function logout() {
            clearSession();
            setSession(null);
            setSelectedAccount(null);
            setBanner({ kind: "success", text: "" });
            setRoute("/login");
        }

        function createAccount() {
            setLoading(true);
            api("/api/accounts", {
                method: "POST",
                body: JSON.stringify({
                    ownerName: createForm.ownerName,
                    accountType: createForm.accountType,
                    openingBalance: Number(createForm.openingBalance)
                })
            }, session).then(function () {
                setCreateForm({ ownerName: "", accountType: "CHECKING", openingBalance: "0" });
                return afterMutation("Account opened successfully.");
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function amountAction(type) {
            setLoading(true);
            api("/api/accounts/" + actionForm.accountId + "/" + type, {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(actionForm.amount),
                    description: actionForm.description
                })
            }, session).then(function () {
                setActionFormState(function (prev) {
                    return Object.assign({}, prev, { amount: "", description: "" });
                });
                return afterMutation(title(type) + " completed.");
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function transfer() {
            setLoading(true);
            api("/api/accounts/transfer", {
                method: "POST",
                body: JSON.stringify({
                    sourceAccountId: transferForm.sourceAccountId,
                    targetAccountId: transferForm.targetAccountId,
                    amount: Number(transferForm.amount),
                    description: transferForm.description
                })
            }, session).then(function () {
                setTransferFormState(function (prev) {
                    return Object.assign({}, prev, { amount: "", description: "" });
                });
                return afterMutation("Transfer completed.");
            }).catch(function (error) {
                flash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        if (!session && route === "/signup") {
            return e(SignupPage, {
                form: signupForm,
                setForm: setSignupField,
                onSubmit: signup,
                loading: loading,
                banner: banner.text,
                bannerKind: banner.kind
            });
        }

        if (!session) {
            return e(LoginPage, {
                form: loginForm,
                setForm: setLoginField,
                onSubmit: login,
                loading: loading,
                banner: banner.text,
                bannerKind: banner.kind
            });
        }

        var heading = route === "/accounts"
            ? "Accounts"
            : route === "/payments"
                ? "Payments"
                : "Dashboard";

        return e(Shell, {
            route: route,
            session: session,
            heading: heading,
            banner: banner.text,
            bannerKind: banner.kind,
            onLogout: logout
        }, route === "/accounts"
            ? e(AccountsPage, {
                accounts: accountPage.content || [],
                page: accountPage.page || 0,
                totalPages: accountPage.totalPages || 1,
                last: accountPage.last,
                selectedAccount: selectedAccount,
                transactions: transactionPage.content || [],
                transactionPage: transactionPage.page || 0,
                transactionTotalPages: transactionPage.totalPages || 1,
                transactionLast: transactionPage.last,
                loading: loading,
                onRefresh: function () { loadAccountsPage(accountPage.page || 0, false); },
                onPageChange: function (page) { loadAccountsPage(page, false); },
                onSelect: function (accountId) { loadAccountDetail(accountId, 0, false); },
                onTransactionPageChange: function (page) {
                    if (selectedAccount) {
                        loadAccountDetail(selectedAccount.id, page, false);
                    }
                }
            })
            : route === "/payments"
                ? e(PaymentsPage, {
                    createForm: createForm,
                    setCreateField: setCreateField,
                    actionForm: actionForm,
                    setActionField: setActionField,
                    transferForm: transferForm,
                    setTransferField: setTransferField,
                    accountOptions: accountOptions,
                    accountTypeOptions: [
                        { value: "CHECKING", label: "Checking" },
                        { value: "SAVINGS", label: "Savings" },
                        { value: "BUSINESS", label: "Business" }
                    ],
                    loading: loading,
                    onCreate: createAccount,
                    onAmountAction: amountAction,
                    onTransfer: transfer
                })
                : e(DashboardPage, {
                    summary: summary,
                    accounts: dashboardAccounts,
                    loading: loading,
                    onRefresh: function () {
                        setLoading(true);
                        Promise.all([loadDashboard(true), loadAccountOptions(true)]).finally(function () {
                            setLoading(false);
                        });
                    }
                })
        );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(e(App));
}());
