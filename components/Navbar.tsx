import { auth, signOut, signIn } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar = async () => {
	const session = await auth();
	console.log(session);

  return (
		<header className="px-5 py-3 bg-white shadow-sm font-work-sans">
			<nav className="flex justify-between items-center">
				<Link href="/">
					<Image src="/logo.png" alt="logo" width={144} height={30} />
				</Link>
				<div className="flex items-center gap-5 text-black">
					{session && session?.user ? (
						<>
							<Link
								href="/startup/create"
								className="relative inline-flex items-center gap-1 text-gray-700 font-semibold text-lg px-4 py-2 transition-all duration-300 ease-in-out hover:text-gray-900 group">
								{/* Create Text */}
								<span className="relative z-10 max-sm:hidden">Create</span>
								<BadgePlus className="size-6 sm:hidden" />
								{/* Elegant Hover Background Effect */}
								<span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out rounded-md"></span>
							</Link>

							<form
								action={async () => {
									"use server";
									await signOut({ redirectTo: "/" });
								}}>
								<button
									type="submit"
									className="relative inline-flex items-center gap-1 text-gray-700 font-semibold text-lg px-4 py-2 transition-all duration-300 ease-in-out hover:text-gray-900 group">
									{/* Logout Text */}
									<span className="relative z-10 max-sm:hidden">Logout</span>
									<LogOut className="size-6 sm:hidden text-red-500" />
									{/* Elegant Hover Background Effect */}
									<span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out rounded-md"></span>
								</button>
							</form>

							<Link
								href={`/user/${session?.id}`}
								className="relative inline-flex items-center gap-2 text-gray-700 font-semibold text-lg px-4 py-2 transition-all duration-300 ease-in-out hover:text-gray-900 group">
								<Avatar className="size-10">
									<AvatarImage
										src={session?.user?.image || ""}
										alt={session?.user?.name || ""}
								  />
								  <AvatarFallback>AV</AvatarFallback>
							  </Avatar>
							  
								{/* Elegant Hover Background Effect */}
							  <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out rounded-md">
								</span>
							</Link>
						</>
					) : (
						<form
							action={async () => {
								"use server";
								await signIn("github");
							}}>
							<button
								type="submit"
								className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-5 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out">
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										d="M12 0C5.372 0 0 5.373 0 12c0 5.304 3.438 9.8 8.207 11.385.6.111.82-.26.82-.577v-2.234c-3.338.726-4.043-1.61-4.043-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.998.108-.775.42-1.305.762-1.605-2.666-.305-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.526.116-3.18 0 0 1.008-.322 3.3 1.23a11.525 11.525 0 0 1 3.005-.404c1.02.004 2.045.137 3.004.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.654.242 2.877.118 3.18.77.84 1.234 1.912 1.234 3.222 0 4.61-2.805 5.624-5.478 5.92.43.372.814 1.104.814 2.224v3.293c0 .319.218.694.825.576C20.565 21.797 24 17.304 24 12c0-6.627-5.373-12-12-12Z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="text-lg font-medium">Login with GitHub</span>
							</button>
						</form>
					)}
				</div>
			</nav>
		</header>
	);
}

export default Navbar
