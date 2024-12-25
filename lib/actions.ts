"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

//all of these functions will be rendered on the server

export const createPitch = async (state: any, form: FormData, pitch: string) => {
    //We need the info of the user who is submitting it
    const session = await auth();

    if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

    //if authenticated, destructure the values from the form
    const { title, description, category, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key != 'pitch'));
    
    const slug = slugify(title as string, { lower: true, strict: true });
    //finally we have the title, description, category, link, pitch, slug. Now we can open a try-catch block

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: 'reference',
                _ref: session?.id,
            },
            pitch
        };

        const result = await writeClient.create({ _type: 'startup', ...startup });

        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        })
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
}

