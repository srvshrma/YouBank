(function () {
    var useEffect = React.useEffect;
    var useState = React.useState;
    var e = React.createElement;

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

    function api(path, options) {
        return fetch(path, Object.assign({
            headers: {
                "Content-Type": "application/json"
            }
        }, options || {})).then(function (response) {
            return response.text().then(function (text) {
                var payload = text ? JSON.parse(text) : {};
                if (!response.ok) {
                    throw new Error(payload.message || "Request failed");
                }
                return payload;
            });
        });
    }

    function Panel(props) {
        return e("section", { className: "panel fade-in " + (props.className || "") }, props.children);
    }

    function Field(props) {
        return e("div", { className: "field" }, [
            e("label", { key: "label", htmlFor: props.id }, props.label),
            props.type === "select"
                ? e("select", {
                    key: "input",
                    id: props.id,
                    value: props.value,
                    onChange: function (event) { props.onChange(event.target.value); }
                }, props.options.map(function (option) {
                    return e("option", { key: option.value, value: option.value }, option.label);
                }))
                : props.type === "textarea"
                    ? e("textarea", {
                        key: "input",
                        id: props.id,
                        rows: props.rows || 3,
                        value: props.value,
                        onChange: function (event) { props.onChange(event.target.value); },
                        placeholder: props.placeholder || ""
                    })
                    : e("input", {
                        key: "input",
                        id: props.id,
                        type: props.type || "text",
                        value: props.value,
                        onChange: function (event) { props.onChange(event.target.value); },
                        placeholder: props.placeholder || "",
                        min: props.min
                    })
        ]);
    }

    function MessageBanner(props) {
        if (!props.message) {
            return null;
        }
        return e("div", {
            className: "banner " + (props.kind === "error" ? "banner-error" : "banner-success")
        }, props.message);
    }

    function Hero(props) {
        return e("div", { className: "hero" }, [
            e("div", { key: "main", className: "hero-card fade-in" }, [
                e("div", { key: "kicker", className: "hero-kicker mono" }, "Spring Boot + React Test Console"),
                e("h1", { key: "title" }, "You Bank Control Room"),
                e("p", { key: "copy" }, "Run real account operations against your Spring Boot API, inspect transaction state, and validate the banking flows from one screen."),
                e("div", { key: "meta", className: "hero-meta" }, [
                    e("div", { key: "accounts", className: "stat-chip" }, [
                        e("span", { key: "label" }, "Accounts"),
                        e("strong", { key: "value" }, props.totalAccounts)
                    ]),
                    e("div", { key: "balance", className: "stat-chip" }, [
                        e("span", { key: "label" }, "Total Balance"),
                        e("strong", { key: "value" }, currency(props.totalBalance))
                    ]),
                    e("div", { key: "average", className: "stat-chip" }, [
                        e("span", { key: "label" }, "Average"),
                        e("strong", { key: "value" }, currency(props.averageBalance))
                    ])
                ])
            ]),
            e("div", { key: "side", className: "hero-card hero-side fade-in stagger-1" }, [
                e("div", { key: "api" }, [
                    e("span", { className: "eyebrow mono" }, "API Surface"),
                    e("div", { className: "value mono" }, "/api/accounts"),
                    e("div", { className: "panel-copy" }, "Same-origin UI served directly by Spring Boot.")
                ]),
                e("div", { key: "summary" }, [
                    e("span", { className: "eyebrow mono" }, "Overview"),
                    e("div", { className: "value mono" }, "/api/accounts/summary"),
                    e("div", { className: "panel-copy" }, "Live metrics for balances, averages, and premium accounts.")
                ])
            ])
        ]);
    }

    function CreateAccountPanel(props) {
        return e(Panel, { className: "stagger-1" }, [
            e("div", { key: "header", className: "panel-header" }, [
                e("div", { key: "titles" }, [
                    e("h2", { key: "title" }, "Open Account"),
                    e("p", { key: "copy", className: "panel-copy" }, "Create seeded test accounts or add new ones with a single request.")
                ])
            ]),
            e("div", { key: "fields", className: "grid-2" }, [
                e(Field, {
                    key: "owner",
                    id: "ownerName",
                    label: "Owner name",
                    value: props.form.ownerName,
                    onChange: function (value) { props.setForm("ownerName", value); },
                    placeholder: "Katherine Johnson"
                }),
                e(Field, {
                    key: "type",
                    id: "accountType",
                    label: "Account type",
                    type: "select",
                    value: props.form.accountType,
                    onChange: function (value) { props.setForm("accountType", value); },
                    options: [
                        { value: "CHECKING", label: "Checking" },
                        { value: "SAVINGS", label: "Savings" },
                        { value: "BUSINESS", label: "Business" }
                    ]
                }),
                e(Field, {
                    key: "opening",
                    id: "openingBalance",
                    label: "Opening balance",
                    type: "number",
                    min: "0",
                    value: props.form.openingBalance,
                    onChange: function (value) { props.setForm("openingBalance", value); },
                    placeholder: "1000"
                })
            ]),
            e("div", { key: "actions", className: "button-row" }, [
                e("button", {
                    key: "submit",
                    className: "button button-accent",
                    onClick: props.onSubmit,
                    disabled: props.loading
                }, props.loading ? "Opening..." : "Create account"),
                e("button", {
                    key: "reset",
                    className: "button button-ghost",
                    onClick: props.onReset,
                    disabled: props.loading
                }, "Reset form")
            ])
        ]);
    }

    function ActionPanel(props) {
        return e(Panel, { className: "stagger-2" }, [
            e("div", { key: "header", className: "panel-header" }, [
                e("div", { key: "titles" }, [
                    e("h2", { key: "title" }, "Move Money"),
                    e("p", { key: "copy", className: "panel-copy" }, "Deposit, withdraw, or transfer against the in-memory repository.")
                ])
            ]),
            e("div", { key: "content", className: "grid-2" }, [
                e("div", { key: "dw" }, [
                    e(Field, {
                        id: "actionAccount",
                        label: "Account",
                        type: "select",
                        value: props.actionForm.accountId,
                        onChange: function (value) { props.setActionForm("accountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        id: "actionAmount",
                        label: "Amount",
                        type: "number",
                        min: "0.01",
                        value: props.actionForm.amount,
                        onChange: function (value) { props.setActionForm("amount", value); },
                        placeholder: "250"
                    }),
                    e(Field, {
                        id: "actionDescription",
                        label: "Description",
                        value: props.actionForm.description,
                        onChange: function (value) { props.setActionForm("description", value); },
                        placeholder: "ATM cash withdrawal"
                    }),
                    e("div", { className: "button-row" }, [
                        e("button", {
                            key: "deposit",
                            className: "button button-primary",
                            onClick: function () { props.onAmountAction("deposit"); },
                            disabled: props.loading || !props.accountOptions.length
                        }, "Deposit"),
                        e("button", {
                            key: "withdraw",
                            className: "button button-ghost",
                            onClick: function () { props.onAmountAction("withdraw"); },
                            disabled: props.loading || !props.accountOptions.length
                        }, "Withdraw")
                    ])
                ]),
                e("div", { key: "transfer" }, [
                    e(Field, {
                        id: "sourceAccount",
                        label: "Source account",
                        type: "select",
                        value: props.transferForm.sourceAccountId,
                        onChange: function (value) { props.setTransferForm("sourceAccountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        id: "targetAccount",
                        label: "Target account",
                        type: "select",
                        value: props.transferForm.targetAccountId,
                        onChange: function (value) { props.setTransferForm("targetAccountId", value); },
                        options: props.accountOptions
                    }),
                    e(Field, {
                        id: "transferAmount",
                        label: "Transfer amount",
                        type: "number",
                        min: "0.01",
                        value: props.transferForm.amount,
                        onChange: function (value) { props.setTransferForm("amount", value); },
                        placeholder: "500"
                    }),
                    e(Field, {
                        id: "transferDescription",
                        label: "Transfer note",
                        value: props.transferForm.description,
                        onChange: function (value) { props.setTransferForm("description", value); },
                        placeholder: "Internal movement"
                    }),
                    e("div", { className: "button-row" }, [
                        e("button", {
                            key: "transferAction",
                            className: "button button-accent",
                            onClick: props.onTransfer,
                            disabled: props.loading || !props.accountOptions.length
                        }, "Transfer funds")
                    ])
                ])
            ])
        ]);
    }

    function SummaryPanel(props) {
        var accountsByType = Object.entries(props.summary.accountsByType || {});
        return e(Panel, { className: "stagger-3" }, [
            e("div", { key: "header", className: "panel-header" }, [
                e("div", { key: "titles" }, [
                    e("h2", { key: "title" }, "Bank Snapshot"),
                    e("p", { key: "copy", className: "panel-copy" }, "Live aggregate view from the backend summary endpoint.")
                ]),
                e("button", {
                    key: "refresh",
                    className: "button button-ghost",
                    onClick: props.onRefresh,
                    disabled: props.loading
                }, "Refresh")
            ]),
            e("div", { key: "summary", className: "summary-grid" }, [
                e("div", { key: "accounts", className: "summary-box" }, [
                    e("span", null, "Total accounts"),
                    e("strong", null, props.summary.totalAccounts || 0)
                ]),
                e("div", { key: "balance", className: "summary-box" }, [
                    e("span", null, "Total balance"),
                    e("strong", null, currency(props.summary.totalBalance))
                ]),
                e("div", { key: "average", className: "summary-box" }, [
                    e("span", null, "Average balance"),
                    e("strong", null, currency(props.summary.averageBalance))
                ])
            ]),
            e("div", { key: "typeBreakdown", className: "subtle-list", style: { marginTop: "14px" } },
                accountsByType.map(function (entry) {
                    return e("div", { key: entry[0] }, title(entry[0]) + ": " + entry[1]);
                })
            ),
            e("div", { key: "premium", className: "footer-note" },
                props.summary.premiumOwners && props.summary.premiumOwners.length
                    ? "Premium owners: " + props.summary.premiumOwners.join(" | ")
                    : "No premium accounts currently cross the configured threshold."
            )
        ]);
    }

    function AccountsPanel(props) {
        return e(Panel, null, [
            e("div", { key: "header", className: "panel-header" }, [
                e("div", { key: "titles" }, [
                    e("h2", { key: "title" }, "Accounts"),
                    e("p", { key: "copy", className: "panel-copy" }, "Inspect balances, metadata, and recent transactions.")
                ]),
                e("button", {
                    key: "refresh",
                    className: "button button-ghost",
                    onClick: props.onRefresh,
                    disabled: props.loading
                }, "Reload accounts")
            ]),
            e("div", { key: "list", className: "account-list" },
                props.accounts.map(function (account) {
                    return e("article", { key: account.id, className: "account-card" }, [
                        e("div", { key: "top", className: "account-card-top" }, [
                            e("div", { key: "identity" }, [
                                e("h3", null, account.ownerName),
                                e("div", { className: "account-meta mono" }, [
                                    e("div", { key: "id" }, account.id),
                                    e("div", { key: "type" }, title(account.accountType))
                                ])
                            ]),
                            e("div", { key: "bal", className: "account-balance mono" }, currency(account.balance))
                        ]),
                        e("div", { key: "badges", className: "badge-row" },
                            (account.tags || []).map(function (tag, index) {
                                return e("span", { key: tag + index, className: "badge" }, tag);
                            })
                        ),
                        e("div", { key: "meta", className: "subtle-list", style: { marginTop: "12px" } },
                            Object.entries(account.metadata || {}).map(function (entry) {
                                return e("div", { key: entry[0] }, entry[0] + ": " + entry[1]);
                            })
                        ),
                        e("div", { key: "transactions", className: "transactions" },
                            (account.transactions || []).slice(-4).reverse().map(function (transaction) {
                                return e("div", { key: transaction.id, className: "transaction-item" }, [
                                    e("div", { key: "left" }, [
                                        e("strong", null, title(transaction.type.replace(/_/g, " "))),
                                        e("div", { className: "account-meta" }, transaction.description)
                                    ]),
                                    e("div", { key: "right", className: "mono" }, currency(transaction.amount))
                                ]);
                            })
                        )
                    ]);
                })
            )
        ]);
    }

    function App() {
        var emptySummary = { totalAccounts: 0, totalBalance: 0, averageBalance: 0, accountsByType: {}, premiumOwners: [] };

        var initialCreateForm = { ownerName: "", accountType: "CHECKING", openingBalance: "0" };
        var [createForm, setCreateForm] = useState(initialCreateForm);
        var [actionForm, setActionFormState] = useState({ accountId: "", amount: "", description: "" });
        var [transferForm, setTransferFormState] = useState({ sourceAccountId: "", targetAccountId: "", amount: "", description: "" });
        var [accounts, setAccounts] = useState([]);
        var [summary, setSummary] = useState(emptySummary);
        var [loading, setLoading] = useState(false);
        var [message, setMessage] = useState({ kind: "success", text: "" });

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

        function setFlash(kind, text) {
            setMessage({ kind: kind, text: text });
        }

        function normalizeAccountSelection(items) {
            if (!items.length) {
                setActionFormState({ accountId: "", amount: "", description: "" });
                setTransferFormState({ sourceAccountId: "", targetAccountId: "", amount: "", description: "" });
                return;
            }

            setActionFormState(function (prev) {
                return Object.assign({}, prev, {
                    accountId: prev.accountId || items[0].id
                });
            });

            setTransferFormState(function (prev) {
                return Object.assign({}, prev, {
                    sourceAccountId: prev.sourceAccountId || items[0].id,
                    targetAccountId: prev.targetAccountId || items[Math.min(1, items.length - 1)].id
                });
            });
        }

        function loadAll(silent) {
            setLoading(!silent);
            return Promise.all([
                api("/api/accounts"),
                api("/api/accounts/summary")
            ]).then(function (results) {
                setAccounts(results[0]);
                setSummary(results[1]);
                normalizeAccountSelection(results[0]);
                if (!silent) {
                    setFlash("success", "Dashboard refreshed from live backend data.");
                }
            }).catch(function (error) {
                setFlash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        useEffect(function () {
            loadAll(true);
        }, []);

        var accountOptions = accounts.map(function (account) {
            return {
                value: account.id,
                label: account.ownerName + " - " + title(account.accountType) + " - " + currency(account.balance)
            };
        });

        function submitCreateAccount() {
            setLoading(true);
            api("/api/accounts", {
                method: "POST",
                body: JSON.stringify({
                    ownerName: createForm.ownerName,
                    accountType: createForm.accountType,
                    openingBalance: Number(createForm.openingBalance)
                })
            }).then(function (created) {
                setCreateForm(initialCreateForm);
                setFlash("success", "Created account for " + created.ownerName + ".");
                return loadAll(true);
            }).catch(function (error) {
                setFlash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function runAmountAction(kind) {
            setLoading(true);
            api("/api/accounts/" + actionForm.accountId + "/" + kind, {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(actionForm.amount),
                    description: actionForm.description
                })
            }).then(function () {
                setActionFormState(function (prev) {
                    return Object.assign({}, prev, { amount: "", description: "" });
                });
                setFlash("success", title(kind) + " completed.");
                return loadAll(true);
            }).catch(function (error) {
                setFlash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        function runTransfer() {
            setLoading(true);
            api("/api/accounts/transfer", {
                method: "POST",
                body: JSON.stringify({
                    sourceAccountId: transferForm.sourceAccountId,
                    targetAccountId: transferForm.targetAccountId,
                    amount: Number(transferForm.amount),
                    description: transferForm.description
                })
            }).then(function () {
                setTransferFormState(function (prev) {
                    return Object.assign({}, prev, { amount: "", description: "" });
                });
                setFlash("success", "Transfer completed.");
                return loadAll(true);
            }).catch(function (error) {
                setFlash("error", error.message);
            }).finally(function () {
                setLoading(false);
            });
        }

        return e("main", { className: "app-shell" }, [
            e(Hero, {
                key: "hero",
                totalAccounts: summary.totalAccounts || 0,
                totalBalance: summary.totalBalance || 0,
                averageBalance: summary.averageBalance || 0
            }),
            e(MessageBanner, { key: "msg", kind: message.kind, message: message.text }),
            e("div", { key: "layout", className: "layout" }, [
                e("div", { key: "left", className: "stack" }, [
                    e(CreateAccountPanel, {
                        key: "create",
                        form: createForm,
                        setForm: setCreateField,
                        onSubmit: submitCreateAccount,
                        onReset: function () { setCreateForm(initialCreateForm); },
                        loading: loading
                    }),
                    e(ActionPanel, {
                        key: "action",
                        actionForm: actionForm,
                        setActionForm: setActionField,
                        transferForm: transferForm,
                        setTransferForm: setTransferField,
                        onAmountAction: runAmountAction,
                        onTransfer: runTransfer,
                        loading: loading,
                        accountOptions: accountOptions
                    }),
                    e(SummaryPanel, {
                        key: "summary",
                        summary: summary,
                        onRefresh: function () { loadAll(false); },
                        loading: loading
                    })
                ]),
                e("div", { key: "right", className: "stack" }, [
                    e(AccountsPanel, {
                        key: "accounts",
                        accounts: accounts,
                        onRefresh: function () { loadAll(false); },
                        loading: loading
                    })
                ])
            ])
        ]);
    }

    ReactDOM.createRoot(document.getElementById("root")).render(e(App));
}());
