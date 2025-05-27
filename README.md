# AASC code-1.0

## Getting Started

**Prerequisites:**

- Nodejs version >= 20

- [ngrok](https://ngrok.com/)

**1. Install the project:**

  ```bash
  # Clone the repository
  git clone https://github.com/AnhBigBrother/aasc-code1.0
  cd aasc-code1.0

  # Install dependencies
  npm install
  ```

**2. Run the development server:**

  ```bash
  npm run dev
  ```

**3. Start ngrok tunnel:**

  ```bash
  ngrok http http://localhost:3000
  ```

**4. Setup Bitrix24:**

- First, create your Bitrix24 local application: Applications (1) -> Developer resources (2) -> Other (3) -> Local application (4).

- Create a server application with handler path = `<ngrok_tunel_domain>/api/oauth/handler`, initial installation path = `<ngrok_tunel_domain>/api/install`, click save.

- Copy the Application ID (client_id), Application key (client_secret) and save them to .env file in the cloned repo
  
  ```bash
  # aasc-code1.0/.env
  NEXT_PUBLIC_CLIENT_ID=<your_client_id>
  CLIENT_SECRET=<your_client_secret>
  ```

- You're ready to go! Now you can start to work with the application by click "Reinstall" in Bitrix24 or go to `<ngrok_tunel_domain>` and log in with your bitrix24 address.

## Feature

**Ex1 ✅:**

- Accept app install event and automatically log in for the installed user.

- Save user access_token and refresh_token to the server.

- Use access_token to call API, auto-renew access_token when it expires.

**Ex2 ✅:**

- Create a contact UI to display, add, edit and delete contacts with some basic information (name, address, email, website, phone number, bank account)

- Use the retrieved access_token and refresh_token to actually communicate with the bitrix24 crm server

_**Tech used:** React(Next.js), shadcn.ui, Zod, react-hook-form_
