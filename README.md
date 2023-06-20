This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## e-Commerce App features

# Database

db using postgresql on Railway
Using prisma to create models.

- Prisma Migrate (npx prisma migrate dev) to insert new models
  Using NextAuth and Google provider to have authentication

- Following the step in the webpage
  https://next-auth.js.org/v3/adapters/prisma

  # Stripe

- Install Stripe in the terminal
- Set an account. Save your keys on you .env.local
- Ser another colum in the user table with stripeCostumerId
- Add and event to our Next Auth. That event will create a user inside Stripe.
  createUser: async ({ user }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
  });
  },
- Create a costumer
  if (user.email && user.name) {
  const costumer = stripe.customers.create({
  email: user.email,
  name: user.name,
  });

  - Update our prisma user with the stripeCostumerId
    - run "npx prisma generate"
  - Add function inside the if that checks the user`s email and name
    await prisma.user.update({
    where: {
    id: user.id,
    },
    data: {
    stripeCustomerId: (await costumer).id,
    },
    });

  # Changes to out Api Route

  - Rename the NextAuth instance. And remove the parentheses.
    export const authOptions = ...
    export default NextAuth(options);

  # Creating our Navbar

  - Create a Nav file and place inside the Layout.
  - Inside Layout file, implement a Fetch on the user. Make the function RootLayout async and implement the code bellow.
    `import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
const session = await getServerSession(authOptions);`

  - Session is a type. So we receive user, as type Session, inside of Nav, so we can read inside component
    `<Nav user={session?.user} expires={session.expires} />`

  - Create a button to sign In
    `
    {/_ If the user is not signed in _/}
    <ul>
      <li>Products</li>
      {!user && (
        <li>
          <button onClick={() => signIn()}>Sing in</button>
        </li>
      )}
    </ul> `

  ` {/* If the user is  signed in */}
        {user && (
          <li>
            <Image
              src={user?.image as string}
              alt={user?.name as string}
              width={48}
              height={48}
            />
          </li>`

  - Add google domain to have the image profile from an outside source
    `const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};`
