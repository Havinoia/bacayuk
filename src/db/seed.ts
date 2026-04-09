import "dotenv/config";
import { db } from "./index";
import { categories, stories } from "./schema";

async function main() {
    console.log("Seeding started...");

    // Clear existing data
    await db.delete(stories);
    await db.delete(categories);

    // Insert categories
    const [fabelCat, legendaCat] = await db.insert(categories).values([
        { name: "Fabel", description: "Cerita tentang hewan yang berperilaku seperti manusia." },
        { name: "Legenda", description: "Cerita rakyat yang dianggap benar-benar terjadi." },
    ]).returning();

    // Insert stories
    await db.insert(stories).values([
        {
            title: "Kancil dan Buaya yang Cerdik",
            slug: "kancil-dan-buaya",
            categoryId: fabelCat.id,
            preview: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Pada suatu hari, Kancil ingin menyeberangi sungai untuk memakan mentimun di seberang sana.",
            content: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Pada suatu hari, Kancil ingin menyeberangi sungai untuk memakan mentimun di seberang sana. Namun, sungai itu penuh dengan buaya yang lapar. Kancil pun berpikir keras. Ia berteriak memanggil buaya, 'Hai Buaya! Raja Hutan ingin menghitung jumlah kalian untuk memberi hadiah!' Buaya pun berkumpul dan berbaris. Kancil melompat dari satu punggung buaya ke punggung lainnya sambil menghitung, hingga akhirnya sampai di seberang sungai. Sambil tertawa, Kancil berteriak, 'Terima kasih Buaya-buaya bodoh! Aku sudah sampai!' Buaya pun merasa kesal namun Kancil sudah lari menjauh.",
            status: "published",
        },
        {
            title: "Asal usul Danau Toba",
            slug: "danau-toba",
            categoryId: legendaCat.id,
            preview: "Dahulu kala, ada seorang pemuda bernama Toba yang hobi memancing. Suatu hari ia menangkap ikan emas besar yang berubah menjadi wanita cantik.",
            content: "Dahulu kala, ada seorang pemuda bernama Toba yang hobi memancing. Suatu hari ia menangkap ikan emas besar yang berubah menjadi wanita cantik. Wanita itu adalah putri yang dikutuk. Toba menikahinya dengan janji tidak akan pernah menyebut asal-usulnya. Mereka memiliki anak bernama Samosir. Suatu hari Samosir menghabiskan bekal ayahnya, Toba marah dan berteriak 'Dasar anak ikan!'. Langit mendung, hujan turun tiada henti, dan desa tenggelam menjadi Danau Toba, sementara tengahnya menjadi Pulau Samosir.",
            status: "published",
        },
        {
            title: "Gajah yang Baik Hati",
            slug: "gajah-baik-hati",
            categoryId: fabelCat.id,
            preview: "Gajah bertubuh besar itu selalu menolong teman-temannya di hutan yang sedang mengalami kesulitan.",
            content: "Gajah bertubuh besar itu selalu menolong teman-temannya di hutan yang sedang mengalami kesulitan. Suatu hari, seekor kancil terjebak di dalam lubang yang cukup dalam. Gajah yang kebetulan lewat mendengar teriakan kancil. Tanpa ragu, gajah menggunakan belalainya yang kuat untuk mengangkat kancil keluar dari lubang tersebut. Kancil merasa sangat bersyukur dan berjanji akan membantu gajah jika gajah membutuhkan bantuan di masa depan.",
            status: "published",
        }
    ]);

    console.log("Seeding completed successfully.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
