# Josh - Your Personal Finance AI Assistant

A command-line AI-powered personal finance assistant that helps you track your expenses, income, and balance through a simple conversational interface. Powered by the high-speed Groq API and Llama 3, Josh can understand your requests and manage your finances for the session.

## Features

- **Conversational Interface**: Interact with Josh in natural language.
- **Expense & Income Tracking**: Add new expenses and income on the fly.
- **Financial Overview**: Get your total expenses and current balance.
- **Tool-Using AI**: Intelligently decides which financial function to call based on your query.
- **High-Speed Responses**: Powered by the Groq API for a real-time, seamless experience.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` (comes with Node.js) or `bun`
- A Groq API Key. You can get one for free from the [Groq Console](https://console.groq.com/keys).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/first-agent.git
    cd first-agent
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
    or if you are using `bun`:
    ```sh
    bun install
    ```

3.  **Set up your environment variables:**
    - Create a new file named `.env` in the root of your project directory.
    - Add your Groq API key to the `.env` file as shown below:
      ```
      GROQ_API_KEY="your-groq-api-key-here"
      ```

## Usage

1.  **Run the agent from your terminal:**
    ```sh
    node agent.js
    ```

2.  The application will start, and you can begin chatting with Josh.

    **Example Conversation:**
    ```
    User: I bought a coffee for 150 INR
    Assistant: Got it. I've added an expense of 150 INR for coffee.

    User: I received my monthly salary of 50000 INR
    Assistant: Great! I've added an income of 50000 INR.

    User: what is my total expense?
    Assistant: Your total expense is 150 INR.

    User: what is my balance?
    Assistant: Your current balance is 49850 INR.
    ```

3.  **To exit the application, simply type `bye` and press Enter.**

## Technologies Used

- **Runtime**: [Node.js](https://nodejs.org/)
- **AI/LLM**: [Groq API](https://groq.com/) with [Llama 3](https://llama.meta.com/llama3/)
- **Dependencies**:
  - `groq-sdk`: The official SDK for interacting with the Groq API.
  - `dotenv`: For managing environment variables securely.
