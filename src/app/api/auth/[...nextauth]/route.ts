import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Accept ANY credentials for UI demo purposes
                if (credentials?.email && credentials?.password) {
                    return {
                        id: 'mock-user-id',
                        name: 'Demo User',
                        email: credentials.email,
                        role: 'candidate', // Default mock role
                        image: null,
                    };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: 'dummy-secret-key-12345',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
