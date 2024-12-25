import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [GitHub],
	callbacks: {
		async signIn({ user : {name, email, image }, profile : { id, login, bio } }) {
			const existingUser = await client.withConfig({ useCdn : false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
				id, //coming from github OAuth
			});
			// if (existingUser) {
			// 	console.log("Below is the authenticated user's details")
			// 	console.log(existingUser);
			// }

			if (!existingUser) {
				await writeClient.create({
					_type: "author",
					id,
					name,
					username: login,
					email,
					image,
					bio: bio || "",
				});
			}
			return true; //to continue the signIn process
		},
		async jwt({ token, account, profile }) {
			if (account && profile) {
				const user = await client.withConfig({ useCdn : false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
					id: profile?.id,
				});
				
				token.id = user?._id;
				// console.log("Token details : ")
				// console.log(token);
			}
			return token;
			//this will allow us to connect the specific github user to a sanity author that can then create a startup 
		},
		async session({ session, token }) {
			Object.assign(session, { id: token.id });
			// console.log("Session details : ");
			// console.log(session);
			return session;
			//returning the modified session after attaching the token id
		}
	}
});
  