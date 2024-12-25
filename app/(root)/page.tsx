import Image from "next/image";
import SearchForm from "../../components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	const query = (await searchParams).query;
	const params = { search: query || null };

	const session = await auth();

	const { data : posts } = await sanityFetch({ query : STARTUPS_QUERY, params }) //renaming data to posts
	
	return (
		<>
			<section className="pink_container">
				<h1 className="heading">
					Share Your Startup idea <br /> Build the Future.
				</h1>
				<p className="sub-heading">
					Pitch Your Ideas, Shape the Best, Rise to Innovation's Spotlight.
				</p>
				<SearchForm query={query} />
			</section>

			<section className="section_container">
				<p className="text-30-semibold">
					{query ? `Search results for "${query}"` : "All Startups"}
				</p>

				<ul className="mt-7 card_grid">
					{posts?.length > 0 ? (
						posts.map((post: StartupTypeCard, index: number) => (
							<StartupCard key={post?._id} post={post} />
						))
					) : (
						<p className="flex items-center justify-center text-gray-500 text-lg font-bold">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-gray-500 font-bold"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10 4a6 6 0 100 12 6 6 0 000-12zm8 14l-4-4"
								/>
							</svg>
							No Startups Found
						</p>
					)}
				</ul>
			</section>

			<SanityLive />
		</>
	);
}
