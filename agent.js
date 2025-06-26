import Groq from "groq-sdk"
import 'dotenv/config';
import readline from 'node:readline/promises'

const expenseDB = []
const incomeDB = []

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function callAgent() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const messages = [
        {
            role: "system",
            content: `You are Josh, a personal finance assistant. Your task is to assist user with their expenses, balances and financial planning.
            current month starting to present date 
            You have access to following tools : 
            1. getTotalExpense : ({from,to}): string //Get total expsense for a time period for that user.
            2. addExpense :({name,amount}): string // Adds up new expense to the expense databse.
            3. addIncome :({name,amount}): string // Adds up new income to the income databse.
            4. getBalance :(): string // Get the remianing balance of the user from database.
            currentdate : ${new Date().toUTCString()}`,
        },
    ];

    /* ===== User Prompt Implementations ===== */
    while (true) {
        const question = await rl.question("User: ");

        if (question == 'bye' || question == 'Bye' || question == 'bye!' || question == 'Bye!') {
            break;
        }

        messages.push({
            role: "user",
            // content: "How much money I have spend this month?",
            content: question,
        });

        /* ===== Agent Implementations ===== */
        while (true) {
            const completion = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "getTotalExpense",
                            description: "The functions(getTotalExpense) work is to retuen the total expense of the user from start date to end date, so the he/she can have a nice idea of their montly expense.",
                            parameters: {
                                type: "object",
                                properties: {
                                    from: {
                                        type: "string",
                                        description: "The starting date of the month from where you have to track all the expenses of the user.",
                                    },
                                    to: {
                                        type: "string",
                                        description: "The ending date of the month until where you have tracked all the expenses of the user.",
                                    },
                                },
                            },
                        },
                    },
                    {
                        type: "function",
                        function: {
                            name: "addExpense",
                            description: "The functions(addExpense) is there to add up thr expense of the user from start date of the current month to end date of the current month, so that they can track their montly expense and can plan there month accordingly.",
                            parameters: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "This shows the name of the expense done by the user in current month. eg. Bought an I-phone for ",
                                    },
                                    amount: {
                                        type: "string",
                                        description: "Amount of the expense.",
                                    },
                                },
                            },
                        },
                    },
                    {
                        type: "function",
                        function: {
                            name: "addIncome",
                            description: "The functions(addIncome) is there to add up the incomes of the user from start date of the current month to end date of the current month, so that they can track their montly income and can plan there month accordingly.",
                            parameters: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "This shows the name of the income by the user in current month. eg. Salary from office.",
                                    },
                                    amount: {
                                        type: "string",
                                        description: "Amount of the income",
                                    },
                                },
                            },
                        },
                    },
                    {
                        type: "function",
                        function: {
                            name: "getBalance",
                            description: "The functions(getBalance) is used to tell the user about the total balance remianing for the current month, so that they can track their saving after all the expenses done during the moneth",
                        },
                    },
                ],
            });

            // console.log(JSON.stringify(completion.choices[0], null, 2));
            messages.push(completion.choices[0].message)

            const toolCalls = completion.choices[0].message.tool_calls
            if (!toolCalls) {
                console.log(`Assitant:${completion.choices[0].message.content}`);
                break;
            }

            for (const tool of toolCalls) {
                const functionName = tool.function.name
                const functionArgs = tool.function.arguments

                let result = ""

                if (functionName == 'getTotalExpense') {
                    result = getTotalExpense(JSON.parse(functionArgs));
                } else if (functionName == 'addExpense') {
                    result = addExpense(JSON.parse(functionArgs));
                } else if (functionName == 'addIncome') {
                    result = addIncome(JSON.parse(functionArgs));
                } else if (functionName == 'getBalance') {
                    result = getBalance(JSON.parse(functionArgs));
                }

                messages.push({
                    role: "tool",
                    content: result,
                    tool_call_id: tool.id,
                })
                // console.log(JSON.stringify(completion2.choices[0], null, 2));
            }
            // console.log("-----------------------------------------");
            // console.log("Messages: ", messages);
            // console.log("-----------------------------------------");
            // console.log("DB: ", expenseDB);
        }
    }
    rl.close()
}

callAgent();

/* ===== Tool Function Implementations ===== */

function getTotalExpense({ from, to }) {
    const total = expenseDB.reduce((acc, item) => acc + item.amount, 0);
    return `${total} INR`;
}

function addExpense({ name, amount }) {
    expenseDB.push({ name, amount: Number(amount) });
    return "Expense added successfully.";
}

function addIncome({ name, amount }) {
    incomeDB.push({ name, amount: Number(amount) });
    return "Income added successfully.";
}

function getBalance() {
    const income = incomeDB.reduce((acc, item) => acc + item.amount, 0);
    const expenses = expenseDB.reduce((acc, item) => acc + item.amount, 0);
    return `${income - expenses} INR`;
}