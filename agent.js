import Groq from "groq-sdk"
import 'dotenv/config';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const messages = [
    {
        role: "system",
        content: `You are a Josh, a personal finance assistant. Your task is to assist user with expenses, balances and financial planning. 
        currentdate : ${new Date().toUTCString()}`,
    },
];

messages.push({
    role: "user",
    // content: "How much money I have spend this month?",
    content: "what about expense?",
},)
async function callAgent() {
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
        ],
    });

    console.log(JSON.stringify(completion.choices[0], null, 2));
    messages.push(completion.choices[0].message)

    const toolCalls = completion.choices[0].message.tool_calls
    if (!toolCalls) {
        console.log(`Assitant:${completion.choices[0].message.content}`)
        return;
    }
    for (const tool of toolCalls) {
        const functionName = tool.function.name
        const functionArgs = tool.function.arguments

        let result = ""

        if (functionName == 'getTotalExpense') {
            result = getTotalExpense(JSON.parse(functionArgs));
        }

        messages.push({
            role: "tool",
            content: result,
            tool_call_id: tool.id,
        })

        const completion2 = await groq.chat.completions.create({
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
            ],
        });

        console.log(JSON.stringify(completion2.choices[0], null, 2));
    }
    console.log("----------------------");
    console.log("Messages: ", messages);
}

callAgent();

/*
    Get total expense
*/

function getTotalExpense({ from, to }) {
    console.log("Get Total Expense too!!");

    // in real we will call DV
    return '10000';
}