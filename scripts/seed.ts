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

    // Insert 3 Premium Stories (ULTRA-EXTENDED VERSIONS)
    await db.insert(storiesTable).values([
        {
            title: "Petualangan Legendaris Si Kancil dan Tentara Buaya",
            slug: "kancil-dan-buaya",
            categoryId: fabelCat.id,
            preview: "Di sebuah hutan rimba yang sangat lebat dan hijau, hiduplah seekor Kancil yang terkenal akan kecerdikannya. Suatu hari, ia sangat ingin menyeberangi sungai demi buah mentimun yang segar.",
            content: "Alkisah, di sebuah hutan rimba yang sangat lebat dan hijau, hiduplah seekor Kancil yang terkenal akan kecerdikannya melampaui seluruh penghuni hutan lainnya. Setiap pagi, Kancil selalu bangun dengan penuh semangat untuk menjelajahi sudut-sudut hutan yang belum pernah ia jamah sebelumnya, mencari sumber makanan terbaik yang bisa ia temukan.\n\nSuatu pagi yang cerah, Kancil sedang berdiri di tepi sebuah sungai yang sangat lebar dan dalam. Di seberang sungai itu, ia melihat deretan pohon buah-buahan yang sudah matang, terutama kebun mentimun kesukaannya yang tampak sangat segar, hijau, dan menggoda selera. Mentimun-mentimun itu terlihat sangat ranum, seolah-olah memanggil Kancil untuk segera mencicipinya.\n\nNamun, masalah besar menghalangi niatnya yang sudah membara. Arus sungai itu sangat deras, berputar-putar menciptakan pusaran air yang berbahaya untuk direnangi oleh siapapun. Lebih parahnya lagi, sungai itu dikuasai oleh sekelompok buaya besar yang sangat lapar dan selalu mengincar siapapun yang berani menyentuh permukaan air yang tenang namun mematikan tersebut.\n\nKancil pun memutuskan untuk duduk terdiam di bawah pohon rindang sambil memutar otaknya yang brilian. Ia melihat ranting-ranting pohon yang hanyut, mencoba menghitung kecepatan arus, namun ia sadar bahwa ia butuh cara yang lebih pasti untuk menjangkau seberang tanpa harus berakhir di dalam perut buaya-buaya yang selalu mengintai tersebut.\n\nTiba-tiba, sebuah ide licik muncul di kepalanya seperti kilat yang menyambar. Kancil pun berjalan perlahan mendekat ke tepian sungai dan berteriak dengan suara yang sangat lantang dan penuh percaya diri, 'Hai para penghuni sungai! Wahai kalian buaya-buaya yang perkasa! Keluarlah! Aku membawa pesan yang sangat luar biasa dari Baginda Raja Hutan!'.\n\nMendengar teriakan itu, seekor buaya paling besar dengan kulit yang tebal dan gigi-gigi tajam muncul ke permukaan, diikuti oleh buaya-buaya lainnya. 'Ada apa Kancil? Mengapa kau berisik sekali pagi-pagi begini di wilayah kekuasaan kami? Apakah kau sudah bosan hidup dan siap untuk menjadi sarapan pagi kami?' tanya buaya pemimpin itu dengan nada mengancam.\n\nKancil tersenyum dengan sangat tenang meskipun dalam hati ia sedikit tegang. 'Tahan dulu rasa laparmu yang besar itu! Baginda Raja akan mengadakan pesta perayaan yang sangat megah hari ini. Beliau memintaku untuk menghitung jumlah pasti kalian semua agar tidak ada satu pun yang kekurangan jatah daging sapi dan kerbau yang lezat di pesta nanti!'.\n\nMendengar kata 'daging sapi dan kerbau lezat', buaya-buaya yang tadinya terlihat garang langsung berubah menjadi sangat antusias. Mata mereka berbinar-binar penuh keserakahan. 'Benarkah itu? Lalu apa yang harus kami lakukan agar kau bisa menghitung kami semua dengan tepat dan tidak ada yang tertinggal?' tanya buaya pemimpin tersebut dengan penuh rasa ingin tahu.\n\nKancil pun memberikan instruksi yang telah ia susun rapi, 'Mudah saja! Kalian semua harus berbaris rapi secara berjajar dari tepi sungai ini hingga ke tepi seberang sana. Aku akan melompat di atas punggung kalian satu persatu sambil menghitung jumlahnya agar laporanku ke Raja sangat akurat dan mengesankan!'.\n\nTanpa berpikir panjang dan tanpa rasa curiga sedikitpun, buaya-buaya yang bodoh itu pun segera memanggil seluruh kawanan mereka. Mereka berbaris membentuk jembatan hidup yang sangat panjang dan kokoh di permukaan air. 'Ayo Kancil, segera hitung kami! Kami sudah tidak sabar menunggu pesta besar dari Baginda Raja!', teriak mereka dengan serempak.\n\nKancil mulai melompat ke punggung buaya pertama dengan ringan, 'Satu!', lalu ke buaya kedua, 'Dua!', dan terus melompat sambil berteriak menghitung jumlah mereka hingga akhirnya ia sampai di tepian sungai seberang. Setiap lompatan ia lakukan dengan penuh kehati-hatian namun tampak sangat meyakinkan di depan mata buaya-buaya yang malang tersebut.\n\nSetelah mendarat dengan aman di atas rumput hijau yang empuk di seberang sungai, Kancil pun berbalik dan tertawa terbahak-bahak hingga perutnya terasa geli. 'Terima kasih ya buaya-buaya yang sangat baik hati dan polos! Sekarang kalian boleh kembali menyelam dan menunggu pesta yang tidak akan pernah ada. Aku hanya butuh bantuan kalian sebagai jembatan saja!'. Kancil pun berlari kencang menuju kebun mentimun favoritnya, meninggalkan para buaya yang hanya bisa meratapi kebodohan mereka.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q"
        },
        {
            title: "Tragedi dan Keajaiban: Legenda Utama Danau Toba",
            slug: "danau-toba",
            categoryId: legendaCat.id,
            preview: "Di sebuah daerah terpencil di Sumatera Utara, hiduplah seorang petani yatim piatu yang sangat rajin bernama Toba. Suatu hari ia mendapatkan ikan ajaib yang mengubah hidupnya selamanya.",
            content: "Dahulu kala di sebuah daerah terpencil di wilayah pedalaman Sumatera Utara, hiduplah seorang laki-laki bernama Toba yang hidup sebatang kara. Pondoknya terletak di pinggir sungai kecil yang airnya sangat jernih. Toba adalah seorang petani yang sangat tekun dalam menggarap sawahnya yang tidak seberapa luas, setiap hari ia bekerja dari fajar menyingsing hingga matahari terbenam.\n\nSelain bertani, hobi utama Toba adalah memancing ikan di sungai tersebut. Bagi Toba, memancing bukan sekadar mencari makan, melainkan cara untuk menenangkan pikiran setelah lelah bekerja seharian. Sungai itu sangat kaya akan berbagai jenis ikan, namun Toba selalu bermimpi ingin mendapatkan sesuatu yang benar-benar istimewa dan luar biasa dari dalam air tersebut.\n\nPada suatu sore yang sangat sunyi dan magis, Toba pergi memancing dengan perasaan yang sangat berbeda dari biasanya. Setelah menunggu beberapa jam, tiba-tiba kailnya ditarik dengan kekuatan yang sangat dahsyat. Toba pun berjuang sekuat tenaga, berkali-kali ia hampir terjatuh ke air, hingga akhirnya ia berhasil mengangkat seekor ikan mas raksasa yang sisiknya berkilauan seperti emas murni di bawah sinar matahari senja.\n\nToba merasa sangat bahagia dan langsung membawa ikan besar itu pulang ke pondoknya. Namun, sebuah keajaiban yang tak masuk akal kembali menyapanya. Saat ia hendak memotong ikan tersebut, ikan itu tiba-tiba berubah menjadi seorang wanita yang sangat cantik jelita dengan tatapan mata yang lembut. Wanita itu menjelaskan bahwa ia adalah seorang putri yang terkena kutukan kiamat dan Toba-lah sang pembebasnya.\n\nSebagai rasa terima kasih, sang putri menyatakan kesediaannya untuk menjadi pendamping hidup Toba. Namun, ia mengajukan sebuah syarat suci yang tidak boleh dilanggar dengan alasan apapun: Toba tidak boleh sekali-kali mengungkapkan bahwa asal-usul istrinya adalah seekor ikan. Jika sumpah itu dilanggar, maka bencana besar yang tak terbayangkan akan melanda seluruh negeri mereka tanpa ampun.\n\nToba pun menyanggupi sumpah tersebut dan mereka pun menikah serta hidup dalam kebahagiaan yang sangat tulus. Beberapa tahun kemudian, lahirlah seorang anak laki-laki yang sehat dan lincah, yang mereka beri nama Samosir. Samosir tumbuh menjadi anak yang sangat dikasihi, namun ia memiliki satu kelemahan yang aneh, yaitu ia selalu merasa lapar yang luar biasa dan sulit sekali untuk merasa kenyang.\n\nSuatu hari yang sangat melelahkan, Samosir diminta oleh ibunya untuk mengantarkan bekal makan siang ke sawah di atas bukit untuk ayahnya. Di tengah perjalanan yang terik, aroma lezat dari bekal tersebut menggoda Samosir dengan sangat kuat. Tanpa bisa menahan nafsu makannya, Samosir memakan satu persatu lauk di dalam bekal tersebut hingga hanya tersisa tulang-tulang dan sedikit nasi dingin saja.\n\nSesampainya di sawah, Samosir dengan perasaan takut menyerahkan bekal yang sudah kosong itu. Toba yang sudah sangat lapar dan lelah bekerja di bawah terik matahari merasa sangat terkejut sekaligus marah besar melihat kelakuan anaknya. Dalam puncak kemarahan yang tidak terkendali, Toba lupa akan sumpahnya yang suci dan berteriak, 'Dasar kau anak ikan yang sama sekali tidak tahu berterima kasih!'.\n\nSeketika itu juga, alam seolah bereaksi terhadap pelanggaran janji tersebut. Langit yang tadinya cerah mendadak berubah menjadi gelap pekat, guntur menggelegar dahsyat, dan bumi mulai bergetar dengan sangat hebat. Samosir yang ketakutan langsung berlari pulang menemui ibunya. Sang ibu hanya bisa menangis sedih karena ia tahu bahwa nasib mereka telah ditentukan oleh pelanggaran sumpah suaminya.\n\nIstri Toba segera menyuruh Samosir berlari ke puncak bukit tertinggi. Tak lama setelah Samosir pergi, dari bekas injakan kaki Toba muncul semburan air yang sangat besar dan panas. Air meluap dengan sangat cepat, menenggelamkan seluruh lembah dan desa sekitarnya. Air yang memenuhi lembah luas itu kemudian membentuk sebuah danau raksasa yang kini kita kenal sebagai Danau Toba yang indah.\n\nSang putri pun akhirnya kembali menjadi ikan yang perkasa, sementara Samosir yang selamat di puncak bukit menjadi penghuni pertama di tanah yang kini kita sebut sebagai Pulau Samosir. Desa-desa yang tenggelam menjadi cerita rakyat, dan Danau Toba tetap tegak berdiri sebagai pengingat abadi bagi siapapun tentang betapa pentingnya menjaga sebuah janji yang tulus dan tidak pernah mengingkarinya.",
            status: "published",
            thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA48-QFJTjN7M3XWVTQqDmlgjLdryrxfZ4nJVk9Z3CgQG-tUJqQk4T54IdP1C1f-8E90rY9o3-QBUHtnb5PnLB2_1uvUzLLENtf0kIeb2GAMNEb5OOOsJY1NRbcYFAUpMCV8OZ7QEyLPZipLAX1Ebbdsjs_zoO9MxEiJ5HjTVpQ1UreHHq1dqdNzFJRtqtAagLiy0gMPwNOsr0UPfPLclnMd4xQXOTdicL45ikidreDix45oMbYF_4tcGWYdtp_pIbN56qgMYf93IA"
        },
        {
            title: "Kasih Sayang dan Keserakahan: Kisah Bawang Merah dan Bawang Putih",
            slug: "bawang-merah-putih",
            categoryId: dongengCat.id,
            preview: "Di sebuah desa kecil, hiduplah dua orang gadis bernama Bawang Merah dan Bawang Putih. Mereka memiliki sifat yang sangat bertolak belakang, sebagaimana siang dan malam.",
            content: "Alkisah di sebuah desa yang sangat tentram dan damai di pinggir sungai, hiduplah sebuah keluarga harmonis yang memiliki seorang putri cantik jelita bernama Bawang Putih. Bawang Putih bukan hanya memiliki paras yang indah, tetapi juga hati yang sangat murni, sabar, dan selalu menolong sesama makhluk hidup. Namun, kebahagiaan itu pudar ketika ibunya meninggal dunia karena sakit parah.\n\nTak lama kemudian, sang ayah memutuskan untuk menikah lagi dengan seorang janda beranak satu yang bernama Bawang Merah. Ibu tiri dan Bawang Merah awalnya tampak sangat manis di depan sang ayah, namun itu semua hanyalah sandiwara yang licik. Ketika sang ayah akhirnya juga meninggal dunia karena sedih yang mendalam, Bawang Putih pun benar-benar sendirian menghadapi kekejaman ibu tiri dan saudara tirinya.\n\nSetiap hari, mulai dari sebelum matahari terbit hingga larut malam, Bawang Putih dipaksa mengerjakan seluruh tugas rumah yang sangat melelahkan tanpa henti. Ia mencuci baju, membersihkan rumah, hingga mencari kayu bakar ke dalam hutan dengan hanya diberikan sedikit nasi kering sebagai makanan. Sementara itu, Bawang Merah dan ibunya hanya duduk santai sambil terus bersolek dan menghabiskan harta peninggalan sang ayah.\n\nPada suatu pagi yang sangat dingin, Bawang Putih sedang mencuci baju ibu tirinya di sungai yang arusnya sedang sangat deras. Karena tangannya yang sudah sangat lelah, selembar baju kesayangan ibu tirinya pun terlepas dan hanyut terbawa pusaran air. Bawang Putih yang sangat ketakutan akan dihukum berat pun memutuskan untuk terus menyusuri sungai tersebut ke arah hilir untuk menemukan baju yang hilang tersebut.\n\nSetelah berjalan sangat jauh menerobos semak belukar dan hutan yang lebat, Bawang Putih menemukan sebuah pintu masuk menuju gua yang tersembunyi di balik sebuah air terjun kecil. Di dalam gua itu, ia bertemu dengan seorang nenek tua yang tampak sangat bijaksana namun misterius. Nenek itu ternyata menyimpan baju yang hanyut dan berjanji akan mengembalikannya dengan satu syarat yang adil.\n\nSyaratnya adalah Bawang Putih harus menemaninya dan membantunya membersihkan gua serta memasak makanan sederhana selama beberapa hari. Dengan ketulusan hati yang tiada banding, Bawang Putih merawat sang nenek bahkan lebih baik dari yang diminta. Ia menyapu lantai, memijat kaki nenek, dan bercerita tentang keindahan dunia luar dengan penuh rasa hormat dan kasih sayang yang mendalam.\n\nSebagai tanda terima kasih yang besar, nenek itu pun menyerahkan kembali baju yang hilang dan memberikan sebuah labu sebagai oleh-oleh. Nenek memberikan dua pilihan: sebuah labu yang sangat besar atau sebuah labu yang berukuran kecil. Bawang Putih yang hatinya bersih dari sifat tamak pun memilih labu yang paling kecil karena ia pikir itu akan lebih ringan dibawanya untuk perjalanan pulang yang jauh.\n\nBetapa terkejutnya seisi rumah ketika Bawang Putih membelah labu kecil tersebut di depan ibu tiri dan Bawang Merah. Dari dalam labu yang mungil itu, mengalirlah berbagai macam perhiasan emas, berlian yang berkilau, dan uang logam yang sangat banyak. Harta itu cukup untuk membiayai kehidupan mereka selamanya. Namun, hal ini justru memicu rasa iri hati dan keserakahan yang luar biasa di hati Bawang Merah.\n\nKeesokan harinya, Bawang Merah dengan sengaja menghanyutkan baju ke sungai dan pergi ke gua nenek tersebut dengan berpura-pura mencari baju. Di depan sang nenek, Bawang Merah bertindak sangat arogan, enggan bekerja, dan selalu mengeluh tentang kotornya gua tersebut. Ia bahkan tidak segan-segan membentak sang nenek agar segera memberinya hadiah labu emas yang ia bayangkan akan lebih banyak dari Bawang Putih.\n\nSesuai rencana liciknya, Bawang Merah tentu saja memilih labu yang ukurannya paling besar dan sangat berat. Dengan susah payah ia menyeret labu itu pulang ke rumahnya sambil bersorak dalam hati. Di rumah, ia dan ibunya sudah tidak sabar untuk menjadi orang terkaya di desa mereka. Mereka mengunci diri di kamar agar tidak ada satu orang pun yang bisa ikut menikmati harta di dalam labu raksasa tersebut.\n\nNamun, bukan harta karun melainkan petaka yang menyapa mereka. Saat labu itu dibelah dengan kapak, keluarlah jutaan ular berbisa, kalajengking, dan binatang buas yang langsung menyerang mereka berdua. Mereka pun berlari tunggang langgang keluar rumah sambil berteriak meminta tolong kepada Bawang Putih. Sejak saat itu, Bawang Merah dan ibunya sadar akan kesalahannya dan mulai belajar tentang arti ketulusan dari Bawang Putih."
        }
    ]);



    console.log("Seeding completed successfully!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
