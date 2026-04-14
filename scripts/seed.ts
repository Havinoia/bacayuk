import "dotenv/config";
import { db } from "../src/db/index";

// Note: Using standard relative paths for the script
import { 
    categories as categoriesTable, 
    stories as storiesTable, 
    readingProgress as readingProgressTable,
    quests as questsTable,
    userQuests as userQuestsTable,
    storyPages as storyPagesTable,
    storyPins as storyPinsTable,
    storyPageFavorites as storyPageFavoritesTable
} from "../src/db/schema";

async function main() {
    console.log("Seeding started...");

    // Clear existing data (Order matters for FK constraints)
    await db.delete(userQuestsTable);
    await db.delete(questsTable);
    await db.delete(readingProgressTable);
    await db.delete(storyPinsTable);
    await db.delete(storyPageFavoritesTable);
    await db.delete(storyPagesTable);
    await db.delete(storiesTable);
    await db.delete(categoriesTable);

    console.log("Database cleared.");

    // Insert categories
    const [fabelCat, legendaCat, dongengCat] = await db.insert(categoriesTable).values([
        { name: "Fabel", description: "Cerita tentang hewan yang berperilaku seperti manusia." },
        { name: "Legenda", description: "Cerita rakyat yang dianggap benar-benar terjadi." },
        { name: "Dongeng", description: "Cerita khayalan atau fantasi yang penuh keajaiban." },
    ]).returning();

    // Insert Quests
    await db.insert(questsTable).values([
        {
            title: "Pembaca Kilat",
            description: "Selesaikan 2 bab hari ini",
            xpReward: 50,
            type: "READING",
            targetValue: 2,
            isDaily: true,
        },
        {
            title: "Pakar Kata",
            description: "Pelajari 5 kosa kata baru",
            xpReward: 30,
            type: "VOCABULARY",
            targetValue: 5,
            isDaily: true,
        }
    ]);

    console.log("Quests seeded.");

    // Insert 3 Premium Stories (EXTENDED VERSIONS)
    await db.insert(storiesTable).values([
        {
            title: "Si Kancil dan Tentara Buaya yang Lapar",
            slug: "kancil-dan-buaya",
            categoryId: fabelCat.id,
            preview: "Di sebuah hutan rimba yang sangat lebat dan hijau, hiduplah seekor Kancil yang terkenal akan kecerdikannya. Suatu hari, ia sangat ingin menyeberangi sungai demi buah mentimun yang segar.",
            content: "Alkisah, di sebuah hutan rimba yang sangat lebat dan hijau, hiduplah seekor Kancil yang terkenal akan kecerdikannya melampaui seluruh penghuni hutan lainnya. Suatu pagi yang cerah, Kancil sedang berdiri di tepi sebuah sungai yang sangat lebar dan dalam. Di seberang sungai itu, ia melihat deretan pohon buah-buahan yang sudah matang, terutama kebun mentimun kesukaannya yang tampak sangat segar dan menggoda selera.\n\nNamun, masalah besar menghalangi niatnya. Arus sungai itu sangat deras dan berbahaya untuk direnangi. Lebih parahnya lagi, sungai itu dikuasai oleh sekelompok buaya besar yang sangat lapar dan selalu mengincar siapapun yang berani menyentuh air. Kancil duduk terdiam sambil memutar otaknya, mencari cara agar bisa menyeberang tanpa harus berakhir di dalam perut buaya-buaya tersebut.\n\nTiba-tiba, sebuah ide licik muncul di kepalanya. Kancil pun berjalan mendekat ke tepian sungai dan berteriak dengan suara yang sangat lantang, 'Hai para buaya! Keluarlah! Aku membawa pesan sangat penting dari Baginda Raja Hutan!'. Mendengar teriakan itu, seekor buaya paling besar muncul ke permukaan. 'Ada apa Kancil? Mengapa kau berisik sekali pagi-pagi begini? Apakah kau sudah siap untuk menjadi sarapan kami?' tanya buaya itu dengan nada mengancam.\n\nKancil tersenyum dengan tenang dan menjawab, 'Tahan dulu rasa laparmu! Baginda Raja akan mengadakan pesta besar-besaran untuk seluruh penghuni hutan hari ini. Beliau memintaku untuk menghitung jumlah kalian semua agar tidak ada satu pun yang kekurangan daging lezat di pesta nanti!'. Mendengar kata 'daging lezat', buaya-buaya lainnya langsung muncul ke permukaan air dengan mata yang berbinar-binar penuh keserakahan.\n\n'Benarkah itu? Lalu apa yang harus kami lakukan agar kau bisa menghitung kami dengan benar?' tanya buaya pemimpin tersebut. Kancil pun memberikan instruksi, 'Mudah saja! Kalian semua harus berbaris rapi secara berjajar dari tepi sungai ini hingga ke tepi seberang sana. Aku akan melompat di atas punggung kalian satu persatu sambil menghitung jumlahnya agar laporanku ke Raja akurat!'. Tanpa berpikir panjang, buaya-buaya yang bodoh itu pun segera membentuk jembatan hidup yang panjang.\n\nKancil mulai melompat ke punggung buaya pertama, 'Satu!', lalu ke buaya kedua, 'Dua!', dan terus melompat sambil berteriak menghitung jumlah mereka hingga akhirnya ia sampai di tepian sungai seberang. Setelah mendarat dengan aman di atas rumput hijau yang empuk, Kancil pun tertawa terbahak-bahak. 'Terima kasih ya buaya-buaya yang baik hati! Sekarang kalian boleh kembali menyelam. Tidak ada pesta dan tidak ada daging lezat. Aku hanya butuh bantuan kalian untuk menyeberang sungai ini saja!', teriak Kancil sambil berlari kencang.\n\nPara buaya itu hanya bisa menggeram marah dan saling menyalahkan karena telah tertipu oleh akal bulus si Kancil yang kecil. Sementara itu, Kancil dengan girangnya menikmati kebun mentimun yang sangat luas di hadapannya, sambil berjanji dalam hati untuk selalu menggunakan kecerdasannya dalam menghadapi rintangan apapun di hutan rimba.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q"
        },
        {
            title: "Legenda Dahsyat Danau Toba",
            slug: "danau-toba",
            categoryId: legendaCat.id,
            preview: "Di sebuah daerah terpencil di Sumatera Utara, hiduplah seorang petani yatim piatu yang sangat rajin bernama Toba. Suatu hari ia mendapatkan ikan ajaib yang mengubah hidupnya selamanya.",
            content: "Dahulu kala di sebuah daerah terpencil di wilayah Sumatera Utara, hiduplah seorang laki-laki bernama Toba yang hidup sebatang kara. Ia adalah seorang petani yang sangat rajin dalam menggarap sawahnya, meskipun hasilnya hanya cukup untuk memenuhi kebutuhan sehari-hari. Selain bertani, satu-satunya hobi Toba adalah memancing ikan di sungai yang mengalir dekat pondok kecilnya untuk dijadikan lauk makan malam.\n\nPada suatu sore yang sunyi, Toba pergi memancing dengan harapan bisa mendapatkan ikan yang cukup besar. Setelah menunggu cukup lama, tiba-tiba kailnya ditarik dengan kekuatan yang sangat luar biasa. Toba pun berjuang sekuat tenaga hingga akhirnya ia berhasil mengangkat seekor ikan mas yang sangat besar dan sisiknya berkilauan seperti emas murni di bawah sinar matahari. Toba merasa sangat senang dan langsung membawa ikan itu pulang untuk dimasak.\n\nNamun, keajaiban terjadi sesampainya di rumah. Saat Toba hendak membersihkan ikan tersebut, tiba-tiba ikan itu berubah menjadi seorang wanita yang sangat cantik jelita. Wanita itu menjelaskan bahwa ia adalah seorang putri yang dikutuk dan Toba telah membebaskannya. Sebagai rasa terima kasih, putri itu bersedia menjadi istri Toba dengan satu syarat yang sangat berat: Toba tidak boleh membocorkan asal-usulnya yang merupakan seekor ikan kepada siapa pun.\n\nToba setuju dengan sumpah tersebut dan mereka pun hidup bahagia. Beberapa tahun berlalu, mereka dikaruniai seorang anak laki-laki yang diberi nama Samosir. Samosir tumbuh menjadi anak yang sehat, namun ia memiliki satu kebiasaan buruk, yaitu selalu merasa lapar dan seringkali menghabiskan makanan jatah ayahnya. Meskipun begitu, Toba dan istrinya tetap mencintai Samosir dengan sepenuh hati dan selalu bersabar menghadapinya.\n\nSuatu hari, Samosir diminta oleh ibunya untuk mengantarkan bekal makan siang ke sawah untuk ayahnya. Di tengah perjalanan, rasa lapar yang hebat melanda Samosir. Tanpa sadar, ia memakan hampir seluruh isi bekal tersebut hingga hanya tersisa sedikit saja. Ketika bertemu Toba yang sudah sangat lapar dan lelah bekerja, Samosir dengan takut memberikan sisa makanan itu. Toba yang melihat bekalnya tinggal sisa-sisa pun menjadi sangat marah dan murka.\n\nDalam kemarahannya yang tidak terkendali, Toba lupa akan sumpahnya dan berteriak, 'Dasar kau anak ikan yang tidak tahu diuntung!'. Seketika itu juga, langit yang cerah berubah menjadi gelap gulita, petir menyambar-nyambar dengan suara menggelegar. Samosir yang ketakutan langsung berlari pulang ke ibunya. Istri Toba yang mendengar hal itu pun menangis sedih karena suaminya telah melanggar janji suci mereka. Ia pun menyuruh Samosir lari ke bukit yang paling tinggi.\n\nTak lama kemudian, dari tempat Toba berdiri muncul sebuah mata air yang sangat deras hingga menenggelamkan seluruh lembah tersebut. Air yang meluap itu membentuk sebuah danau yang sangat besar yang kini dikenal sebagai Danau Toba. Sang istri pun kembali menjadi ikan, sementara Samosir terjebak di tanah yang paling tinggi di tengah danau, yang kini kita kenal sebagai Pulau Samosir. Legenda ini menjadi pengingat bagi kita semua untuk selalu menepati janji yang telah kita ucapkan.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA48-QFJTjN7M3XWVTQqDmlgjLdryrxfZ4nJVk9Z3CgQG-tUJqQk4T54IdP1C1f-8E90rY9o3-QBUHtnb5PnLB2_1uvUzLLENtf0kIeb2GAMNEb5OOOsJY1NRbcYFAUpMCV8OZ7QEyLPZipLAX1Ebbdsjs_zoO9MxEiJ5HjTVpQ1UreHHq1dqdNzFJRtqtAagLiy0gMPwNOsr0UPfPLclnMd4xQXOTdicL45ikidreDix45oMbYF_4tcGWYdtp_pIbN56qgMYf93IA"
        },
        {
            title: "Kisah Klasik Bawang Merah dan Bawang Putih",
            slug: "bawang-merah-putih",
            categoryId: dongengCat.id,
            preview: "Di sebuah desa kecil, hiduplah dua orang gadis bernama Bawang Merah dan Bawang Putih. Mereka memiliki sifat yang sangat bertolak belakang, sebagaimana siang dan malam.",
            content: "Zaman dahulu kala di sebuah desa yang damai, hiduplah sebuah keluarga yang terdiri dari seorang ayah, ibu, dan seorang putri cantik bernama Bawang Putih. Bawang Putih adalah gadis yang sangat rajin, patuh, dan baik hati. Namun, kebahagiaan mereka sirna ketika sang ibu meninggal dunia. Beberapa waktu kemudian, sang ayah menikah lagi dengan seorang janda yang memiliki seorang putri sebaya dengan Bawang Putih, yang bernama Bawang Merah.\n\nPada awalnya, ibu tiri dan Bawang Merah bersikap sangat baik kepada Bawang Putih. Namun, setelah sang ayah tercinta juga meninggal dunia, sifat asli mereka mulai muncul. Setiap hari, Bawang Putih dipaksa untuk melakukan seluruh pekerjaan rumah yang sangat berat secara sendirian, sementara Bawang Merah dan ibunya hanya bersantai dan bersolek diri. Bawang Putih seringkali dimarahi dan dihukum jika pekerjaannya dianggap tidak sempurna.\n\nPada suatu hari, ketika sedang mencuci baju di sungai yang arusnya cukup kencang, sebuah baju kesayangan ibu tirinya hanyut terbawa arus. Bawang Putih yang sangat ketakutan pun menyusuri sungai tersebut hingga jauh ke dalam hutan untuk mencari baju yang hilang. Setelah berjalan cukup lama, ia bertemu dengan seorang nenek tua yang tinggal sendirian di sebuah gua yang tersembunyi. Nenek itu berkata bahwa ia menemukan baju tersebut dan akan mengembalikannya jika Bawang Putih mau membantunya membersihkan gua tersebut.\n\nDengan senang hati dan tulus, Bawang Putih membantu sang nenek membersihkan seluruh gua sampai tampak sangat rapi dan bersih. Sebagai rasa terima kasih, nenek itu mengembalikan baju yang hanyut dan memberikan sebuah labu sebagai hadiah. Nenek itu menyuruh Bawang Putih memilih antara labu kecil atau labu besar. Bawang Putih yang tidak serakah pun memilih labu yang paling kecil karena ia merasa itu sudah cukup baginya.\n\nSesampainya di rumah, Bawang Putih menceritakan kejadian tersebut kepada ibu tiri dan Bawang Merah. Ketika mereka membelah labu kecil tersebut, betapa terkejutnya mereka karena dari dalam labu itu keluarlah tumpukan emas, permata, dan berlian yang sangat banyak. Melihat harta tersebut, Bawang Merah yang serakah pun langsung menyusun rencana jahat. Ia sengaja menghanyutkan baju ke sungai dan pergi menemui nenek tua tersebut keesokan harinya.\n\nNamun, di gua sang nenek, Bawang Merah bersikap sangat malas dan kasar. Ia tidak mau membantu membersihkan gua dan malah membentak nenek itu untuk segera memberikannya labu hadiah. Nenek itu pun memberikan pilihan yang sama. Bawang Merah yang sangat tamak tentu saja memilih labu yang ukurannya paling besar. Ia pun membawa pulang labu itu dengan hati yang sangat gembira, membayangkan kekayaan yang jauh lebih besar dari milik Bawang Putih.\n\nSetibanya di rumah, Bawang Merah dan ibunya langsung mengunci diri di kamar dan membelah labu raksasa tersebut dengan antusias. Namun, bukannya perhiasan atau emas, tiba-tiba dari dalam labu itu keluarlah ratusan ular berbisa dan kalajengking yang sangat menakutkan. Mereka pun berlari ketakutan keluar rumah sambil meminta maaf kepada Bawang Putih atas segala kejahatan mereka selama ini. Akhirnya, Bawang Putih yang pemaaf pun memaafkan mereka dan mereka pun hidup dengan lebih baik dan tidak lagi memiliki sifat yang serakah.",
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
