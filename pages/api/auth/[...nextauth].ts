import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  events: {
    /// Stripe instance
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-11-15",
      });

      // Create Stripe Costumer
      if (user.email && user.name) {
        const costumer = stripe.customers.create({
          email: user.email,
          name: user.name,
        });

        // Also update our prisma user with the stripeCostumerId
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeCustomerId: (await costumer).id,
          },
        });
      }
    },
  },
});
