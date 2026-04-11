import "dotenv/config";
import { db } from "../src/db/index";

// Note: Using standard relative paths for the script
import { 
    categories as categoriesTable, 
    stories as storiesTable, 
    readingProgress as readingProgressTable
} from "../src/db/schema";

async function main() {
    console.log("Seeding started...");

    // Clear existing data (Order matters for FK constraints)
    await db.delete(readingProgressTable);
    await db.delete(storiesTable);
    await db.delete(categoriesTable);

    console.log("Database cleared.");

    // Insert categories
    const [fabelCat, legendaCat, dongengCat] = await db.insert(categoriesTable).values([
        { name: "Fabel", description: "Cerita tentang hewan yang berperilaku seperti manusia." },
        { name: "Legenda", description: "Cerita rakyat yang dianggap benar-benar terjadi." },
        { name: "Dongeng", description: "Cerita khayalan atau fantasi yang penuh keajaiban." },
    ]).returning();

    // Insert 3 Premium Stories
    await db.insert(storiesTable).values([
        {
            title: "Kancil dan Buaya yang Cerdik",
            slug: "kancil-dan-buaya",
            categoryId: fabelCat.id,
            preview: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Pada suatu hari, Kancil ingin menyeberangi sungai untuk memakan mentimun di seberang sana.",
            content: "Di sebuah hutan yang lebat, hiduplah seekor Kancil yang sangat pintar. Setiap hari ia mencari mentimun segar di kebun seberang sungai. Namun, sungai itu sangat deras dan penuh dengan buaya yang lapar.\n\nSuatu hari, Kancil mendapat ide cemerlang. Ia berdiri di pinggir sungai dan berseru, 'Hai Buaya! Raja Hutan ingin menghitung kalian untuk memberi hadiah pesta!' Buaya-buaya yang rakus itu pun segera berkumpul.\n\n'Berbarislah sampai ke seberang!' perintah Kancil. Buaya pun berbaris rapi. Kancil mulai melompat di atas punggung mereka sambil menghitung, 'Satu... dua... tiga...' hingga akhirnya ia sampai di seberang dengan selamat.\n\n'Terima kasih ya buaya bodoh! Aku hanya butuh bantuan kalian untuk menyeberang saja!' teriak Kancil sambil berlari menuju kebun mentimun favoritnya. Buaya-buaya itu hanya bisa menggeram menyesal.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q"
        },
        {
            title: "Asal Usul Danau Toba",
            slug: "danau-toba",
            categoryId: legendaCat.id,
            preview: "Dahulu kala, ada seorang pemuda bernama Toba yang hobi memancing. Suatu hari ia menangkap ikan emas besar yang berubah menjadi wanita cantik.",
            content: "Di Sumatera Utara, hiduplah seorang petani bernama Toba yang sangat rajin bekerja. Suatu sore, Toba pergi memancing dan mendapatkan seekor ikan mas yang sangat besar dan berkilauan.\n\nSaat dibawa pulang, tiba-tiba ikan itu berubah menjadi seorang wanita yang sangat cantik jelita. Wanita itu berterima kasih karena Toba telah membebaskannya dari kutukan. Mereka akhirnya menikah dengan satu syarat: Toba tidak boleh membocorkan asal-usul istrinya yang seekor ikan.\n\nBeberapa tahun kemudian, lahirlah Samosir. Samosir tumbuh menjadi anak yang nakal. Suatu hari, Samosir menghabiskan bekal makan siang ayahnya. Toba yang marah besar tak sengaja berteriak, 'Dasar anak ikan!'\n\nSeketika itu juga, langit menjadi gelap dan hujan turun sangat lebat. Seluruh desa tenggelam menjadi danau besar yang kini kita kenal sebagai Danau Toba, dan di tengahnya terdapat pulau kecil bernama Pulau Samosir.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA48-QFJTjN7M3XWVTQqDmlgjLdryrxfZ4nJVk9Z3CgQG-tUJqQk4T54IdP1C1f-8E90rY9o3-QBUHtnb5PnLB2_1uvUzLLENtf0kIeb2GAMNEb5OOOsJY1NRbcYFAUpMCV8OZ7QEyLPZipLAX1Ebbdsjs_zoO9MxEiJ5HjTVpQ1UreHHq1dqdNzFJRtqtAagLiy0gMPwNOsr0UPfPLclnMd4xQXOTdicL45ikidreDix45oMbYF_4tcGWYdtp_pIbN56qgMYf93IA"
        },
        {
            title: "Bawang Merah dan Bawang Putih",
            slug: "bawang-merah-putih",
            categoryId: dongengCat.id,
            preview: "Kisah dua kakak beradik yang memiliki sifat berbeda. Bawang Putih yang baik hati dan Bawang Merah yang pemalas dan sombong.",
            content: "Dahulu kala di sebuah desa, hiduplah dua orang gadis bernama Bawang Merah dan Bawang Putih. Bawang Putih adalah gadis yang rajin dan rendah hati, sedangkan Bawang Merah sangat malas dan manja oleh ibunya.\n\nSuatu hari, Bawang Putih sedang mencuci baju di sungai dan sebuah kain kesayangan ibunya hanyut. Ia mencari kain itu sampai bertemu seorang nenek tua di dalam gua. Sang nenek akan mengembalikan kain itu jika Bawang Putih mau membantunya membersihkan gua.\n\nBawang Putih membantu dengan senang hati. Sebagai hadiah, nenek memberinya sebuah labu. Saat sampai di rumah dan membelahnya, ternyata labu itu berisi banyak sekali emas dan berlian!\n\nBawang Merah yang iri kemudian sengaja menghanyutkan kain dan menghampiri nenek tersebut. Namun karena sifatnya yang sombong dan tidak mau bekerja, nenek memberinya labu yang berbeda. Saat dibelah, labu milik Bawang Merah justru berisi ular dan kalajengking sebagai balasan atas ketidaksetiaannya.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYKUEVKEeTstQ0TLIVdQu6KtEpBU_BMzDIKSjHWcSACco399MZNApjqmfHjl8kvOXI4v8EeP25sfayVsgfRcVZ6klwuRz22ZhiWmbxidCO2KpGD7ToL4_oIJ_d53z3ky4PvShPrSnZvp9nnPIr3NqQjoVue0RXP3SHhI8rhE1Aw0QNsoiNHgzd_Ep61X5CfAXWDBChq-STrnAnZhpXjExNNDT5OMHbea_R78vc2cT7YghHCpRqo47UzFyEculK1TYcQgWLs_p68-o"
        }
    ]);

    console.log("Seeding completed successfully!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
