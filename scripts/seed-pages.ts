import "dotenv/config";
import { db } from "../src/db/index";
import { 
    stories as storiesTable, 
    storyPages as storyPagesTable,
    storyPins as storyPinsTable,
    storyPageFavorites as storyPageFavoritesTable
} from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding story pages...");

    // Clear existing pins/favorites/pages to prevent ID conflicts during testing
    await db.delete(storyPinsTable);
    await db.delete(storyPageFavoritesTable);
    await db.delete(storyPagesTable);

    const allStories = await db.select().from(storiesTable);

    if (allStories.length === 0) {
        console.error("No stories found. Please run npm run db:seed first.");
        process.exit(1);
    }

    for (const story of allStories) {
        console.log(`Creating pages for: ${story.title}`);
        
        // Split existing content into 3 simple pages based on double newlines or just manually for demo
        const contentParts = story.content.split("\n\n");
        
        const pagesToInsert = contentParts.map((part, index) => ({
            storyId: story.id,
            pageNumber: index + 1,
            content: part,
        }));

        if (pagesToInsert.length > 0) {
            await db.insert(storyPagesTable).values(pagesToInsert);
            console.log(`Inserted ${pagesToInsert.length} pages for story ${story.id}`);
        }
    }

    console.log("Seeding pages completed successfully!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding pages failed:", err);
    process.exit(1);
});
