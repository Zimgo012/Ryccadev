import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "zod";

const projects = defineCollection({
    loader: glob({base: "src/content/json/projects", pattern: "*.json"
    }),

    schema: z.object({
        projects: z.array(
            z.object({
                name: z.string(),
                summary: z.string(),
                projectlink: z.string(),
                blogLink: z.string(),
                technologies: z.array(z.string()),
            })
        )
    })
});

const blogs = defineCollection({
    loader: glob({base: 'src/content/md/blogs', pattern: '*.md'}),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        author: z.string(),
        date: z.string(),
        tags: z.array(z.string()),

    })
})
export const collections = {projects, blogs}