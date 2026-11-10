// export const getFinanceResponse = (
//     type,
//     { goals, totalSaved }
// ) => {

//     const income = 120000;

//     const needs = Math.round(income * 0.5);
//     const wants = Math.round(income * 0.3);
//     const savings = Math.round(income * 0.2);

//     const weeklyLimit = Math.round(wants / 4);

//     const responses = {

//         budget: `
// 📊 SMART BUDGET OVERVIEW

// Recommended Monthly Allocation:

// • Needs → KES ${needs.toLocaleString()}
//   Rent, transport, food, bills

// • Wants → KES ${wants.toLocaleString()}
//   Entertainment, shopping, dining

// • Savings → KES ${savings.toLocaleString()}
//   Emergency fund & investments

// 💡 Insight:
// The 50/30/20 rule helps prevent overspending while maintaining healthy savings growth.

// ✅ Recommendation:
// Automate savings immediately after salary is received.
//         `,

//         saving: `
// 🏦 AUTOMATIC SAVING PLAN

// Suggested Plan:

// • Save at least 20% of income
// • Create emergency savings first
// • Use automatic weekly transfers
// • Avoid touching long-term savings

// 📈 Current Progress:
// KES ${totalSaved.toLocaleString()} saved

// 💡 Pro Tip:
// Small consistent savings outperform irregular large deposits.
//         `,

//         weekly: `
// 💳 WEEKLY SPENDING CONTROL

// Suggested Weekly Spending Limit:
// KES ${weeklyLimit.toLocaleString()}

// Recommended Categories:

// • Food & groceries
// • Transport
// • Entertainment
// • Shopping

// 🚨 Smart Advice:
// If you exceed your limit early in the week,
// reduce non-essential spending for the remaining days.
//         `,

//         goals: `
// 🎯 FINANCIAL GOALS DASHBOARD

// Active Goals:
// ${goals.length}

// Total Saved:
// KES ${totalSaved.toLocaleString()}

// Suggested Goal Types:

// • Emergency Fund
// • Travel Savings
// • Investment Capital
// • Business Fund
// • School Fees

// 📌 Financial Discipline:
// Consistent deposits build financial confidence.
//         `,

//         transactions: `
// 🧾 TRANSACTION ANALYSIS

// Your recent spending patterns may include:

// • Frequent food deliveries
// • Transport costs
// • Entertainment expenses
// • Small impulse purchases

// 📉 Hidden Spending Risk:
// Small daily purchases accumulate significantly over time.

// 💡 Smart Action:
// Track recurring subscriptions and reduce unnecessary expenses.
//         `,

//         education: `
// 📚 FINANCIAL EDUCATION

// Healthy financial habits include:

// • Budget tracking
// • Saving before spending
// • Building emergency reserves
// • Avoiding unnecessary debt
// • Long-term investing

// 📈 Important Principle:
// Financial growth is built through consistency, not speed.

// 💡 Rule:
// Spend less than you earn consistently.
//         `,

//         alerts: `
// 🚨 SMART FINANCIAL ALERT

// Your spending activity is approaching your recommended limit.

// Suggestions:

// • Pause impulse purchases
// • Delay non-essential shopping
// • Review subscriptions
// • Focus on savings goals

// 📌 Reminder:
// Financial awareness reduces unnecessary spending.
//         `,

//         motivation: `
// 🔥 MOTIVATION MODE

// Every disciplined financial decision improves your future stability.

// Remember:

// • Saving is self-investment
// • Consistency beats intensity
// • Financial freedom takes patience

// 💪 You're building stronger money habits every day.
//         `,

//         help: `
// 🤖 ZENI ASSISTANT HELP

// I can help with:

// • Budget planning
// • Saving strategies
// • Weekly spending limits
// • Financial education
// • Smart money advice
// • Goal tracking
// • Spending awareness

// Try asking:

// • "Show my budget"
// • "Help me save"
// • "Weekly spending tips"
// • "Financial education"
//         `
//     };

//     return responses[type];
// };