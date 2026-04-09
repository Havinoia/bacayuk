import "dotenv/config";
import { db } from "../src/db/index";
import { categories, stories } from "../src/db/schema";

async function main() {
    console.log("Seeding started...");

    // Clear existing data
    await db.delete(stories);
    await db.delete(categories);

    // Insert categories
    const [fabelCat, legendaCat, dongengCat] = await db.insert(categories).values([
        { name: "Fabel", description: "Cerita tentang hewan yang berperilaku seperti manusia." },
        { name: "Legenda", description: "Cerita rakyat yang dianggap benar-benar terjadi." },
        { name: "Dongeng", description: "Cerita khayalan atau fantasi yang penuh keajaiban." },
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
            title: "Bawang Merah dan Bawang Putih",
            slug: "bawang-merah-putih",
            categoryId: dongengCat.id,
            preview: "Dua kakak beradik yang memiliki sifat berbeda. Bawang Putih yang baik hati dan Bawang Merah yang pemalas dan sombong.",
            content: "Dahulu kala di sebuah desa, hiduplah Bawang Putih yang rajin dan baik hati. Ia tinggal bersama ibu tiri dan saudara tirinya, Bawang Merah, yang sangat nakal. Suatu hari, kain kesayangan ibunya hanyut ke sungai. Bawang Putih mencarinya hingga bertemu seorang nenek tua yang ramah. Sebagai ucapan terima kasih karena dibantu, nenek itu memberi hadiah dua buah labu. Saat dibelah di rumah, labu milik Bawang Putih berisi perhiasan mewah, sementara labu milik Bawang Merah berisi ular karena ia tidak sopan pada nenek tersebut.",
            status: "published",
        },
        {
            title: "Timun Mas",
            slug: "timun-mas",
            categoryId: dongengCat.id,
            preview: "Kisah seorang gadis pemberani yang berusaha melarikan diri dari kejaran Raksasa jahat menggunakan kantong ajaib.",
            content: "Mbok Srini sangat mendambakan seorang anak. Ia bertemu Raksasa yang memberinya biji timun ajaib. Dari timun besar itu, lahirnya bayi cantik bernama Timun Mas. Namun, Raksasa meminta Timun Mas dikembalikan saat sudah besar. Mbok Srini memberi Timun Mas empat kantong ajaib: garam, cabai, jarum, dan terasi. Saat dikejar Raksasa, garam menjadi lautan, cabai menjadi semak berduri, jarum menjadi hutan bambu, dan terasi menjadi lumpur mendidih yang akhirnya menenggelamkan Raksasa tersebut.",
            status: "published",
        },
        {
            title: "Malin Kundang",
            slug: "malin-kundang",
            categoryId: legendaCat.id,
            preview: "Kisah seorang anak yang merantau dan menjadi kaya, namun ia melupakan dan durhaka kepada ibunya sendiri.",
            content: "Malin Kundang adalah pemuda miskin yang merantau untuk mengubah nasib. Bertahun-tahun kemudian, ia kembali ke desanya sebagai saudagar kaya dengan kapal besar dan istri cantik. Ketika ibunya yang tua dan miskin menyambutnya, Malin merasa malu dan mengusirnya. Merasa sangat sedih, ibunya berdoa memohon keadilan. Seketika langit gelap, badai besar menghantam kapal Malin, dan Malin Kundang dikutuk menjadi batu sebagai peringatan bagi anak-anak yang durhaka.",
            status: "published",
        },
        {
            title: "Lutung Kasarung",
            slug: "lutung-kasarung",
            categoryId: dongengCat.id,
            preview: "Pangeran yang dikutuk menjadi kera dan turun ke bumi untuk menemukan cinta sejatinya, Putri Purbasari.",
            content: "Lutung Kasarung adalah seekor kera yang sebenarnya adalah seorang pangeran dari khayangan. Ia turun ke bumi untuk membantu Putri Purbasari yang diusir dari istana oleh kakaknya yang iri, Purbararang. Berkat kesabaran dan kebaikan hati Purbasari, Lutung Kasarung akhirnya berubah kembali menjadi pangeran tampan. Mereka berdua pun memerintah kerajaan dengan bijaksana, sementara kakaknya yang jahat mendapatkan balasan atas perbuatannya.",
            status: "published",
        },
        {
            title: "Sangkuriang",
            slug: "sangkuriang",
            categoryId: legendaCat.id,
            preview: "Kisah terciptanya Gunung Tangkuban Perahu karena kegagalan Sangkuriang memenuhi syarat mustahil Dayang Sumbi.",
            content: "Sangkuriang jatuh cinta pada Dayang Sumbi tanpa tahu bahwa ia adalah ibunya sendiri. Dayang Sumbi yang menyadari hal itu memberikan syarat mustahil: Sangkuriang harus membendung sungai Citarum dan membuat perahu besar dalam satu malam. Hampir berhasil dengan bantuan makhluk halus, Dayang Sumbi menipu Sangkuriang agar fajar datang lebih cepat. Marah karena gagal, Sangkuriang menendang perahu buatannya hingga terbalik dan menjadi Gunung Tangkuban Perahu.",
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

    console.log("Seeding completed successfully with new Fairy Tales!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
