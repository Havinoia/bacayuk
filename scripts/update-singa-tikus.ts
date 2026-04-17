import "dotenv/config";
import { db } from "../src/db/index";
import { storyPages, stories } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

async function main() {
    console.log("🛠️ Updating 'Singa dan Tikus' with AI images...");

    const story = await db.query.stories.findFirst({
        where: eq(stories.slug, "singa-tikus")
    });

    if (!story) {
        console.error("❌ Story 'singa-tikus' not found!");
        process.exit(1);
    }

    for (let i = 1; i <= 10; i++) {
        const imageUrl = `/images/stories/singa-tikus/p${i}.png`;
        
        await db.update(storyPages)
            .set({ imageUrl })
            .where(and(
                eq(storyPages.storyId, story.id),
                eq(storyPages.pageNumber, i)
            ));
        
        console.log(`✅ Page ${i} updated.`);
    }

    console.log("✨ Update complete!");
    process.exit(0);
}

main().catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});
