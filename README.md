# 📖 Bacayuk: Keajaiban Literasi Digital Anak

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle)](https://orm.drizzle.team/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-1.0-FF4500?style=flat-square)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Bacayuk** adalah platform bacaan anak interaktif yang menggabungkan keajaiban bercerita dengan mekanisme game RPG (Role-Playing Game). Dirancang untuk menumbuhkan minat baca sejak dini melalui pengalaman yang modern, aman, dan sangat imersif.

---

## ✨ Fitur Utama

-   **🏰 Magical Academy Dashboard**: Antarmuka dashboard bertema akademi sihir yang memandu anak-anak dalam petualangan membaca mereka.
-   **⚔️ RPG Progression System**: Pilih kelas Hero-mu! Kumpulkan XP, tingkatkan Level, dan perkuat statistik (HP, Attack, Defense, Speed) setiap kali menyelesaikan bacaan.
-   **📜 Immersive Reading Experience**: Cerita multi-halaman dengan paragraf yang dioptimalkan untuk konsentrasi anak dan visual yang memukau.
-   **🎯 Misi Harian (Daily Quests)**: Selesaikan tantangan membaca setiap hari untuk mendapatkan hadiah dan menjaga momentum literasi.
-   **🔖 Sistem Bookmark (Saved Stories)**: Simpan koleksi cerita favorit untuk dibaca kembali kapan saja.
-   **🤖 AI-Powered Visuals**: Setiap cerita dilengkapi dengan visual orisinal yang dihasilkan oleh AI untuk membantu imajinasi anak.

---

## 🛠️ Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **State Management & Logic**: React 19
-   **Database & ORM**: PostgreSQL dengan Drizzle ORM
-   **Authentication**: BetterAuth (Seamless & Secure)
-   **Styling**: Tailwind CSS 4.0
-   **Icons**: Lucide React

---

## 🚀 Cara Instalasi

Ikuti langkah-langkah berikut untuk menjalankan Bacayuk di mesin lokal Anda:

1.  **Clone Repositori**:
    ```bash
    git clone https://github.com/Havinoia/bacayuk.git
    cd bacayuk
    ```

2.  **Instal Dependensi**:
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**:
    Salin file `.env.example` menjadi `.env` dan lengkapi variabel yang diperlukan:
    ```bash
    cp .env.example .env
    ```
    *Pastikan `DATABASE_URL` mengarah ke instance PostgreSQL Anda.*

4.  **Setup Database**:
    ```bash
    npm run db:setup    # Membuat database (jika belum ada)
    npm run db:push     # Sinkronisasi skema ke database
    npm run db:seed     # Memasukkan data awal, cerita, dan kategori
    ```

5.  **Jalankan Server Pengembangan**:
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Struktur Perintah

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun aplikasi untuk produksi |
| `npm run start` | Menjalankan aplikasi hasil build |
| `npm run lint` | Mengecek kualitas kode dengan ESLint |
| `npm run db:studio` | Interface GUI untuk mengelola database |

---

## 🛡️ Kontrol Akses

Aplikasi ini menggunakan **BetterAuth**. 
-   **Guest**: Dapat mencoba fitur eksplorasi dan membaca intro cerita.
-   **User**: Akses penuh ke konten cerita, progres RPG, dan fitur bookmark.

---

Dibuat dengan ❤️ oleh **Team Bacayuk**

