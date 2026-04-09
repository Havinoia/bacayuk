# Bacayuk

Platform cerita anak yang interaktif dan mendidik.

## Teknologi
- Next.js 16 (App Router)
- Drizzle ORM
- BetterAuth (Authentication)
- PostgreSQL (Database)
- Tailwind CSS (Styling)

## Cara Instalasi
1. Clone repositori ini.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env` dan isi variabel yang diperlukan (terutama `DATABASE_URL`).

## Perintah Pengembangan
- `npm run dev`: Menjalankan server pengembangan.
- `npm run build`: Membangun aplikasi untuk produksi.
- `npm run start`: Menjalankan aplikasi hasil build.
- `npm run lint`: Menjalankan linter untuk mengecek kualitas kode.

### Perintah Database
- `npm run db:setup`: Membuat database baru jika belum ada.
- `npm run db:push`: Sinkronisasi skema Drizzle ke database PostgreSQL.
- `npm run db:seed`: Memasukkan data awal (cerita & kategori) ke database.
- `npm run db:studio`: Membuka interface browser untuk mengelola database secara visual.

## Autentikasi
Aplikasi ini menggunakan [BetterAuth](https://better-auth.com/).
Halaman Login: `/auth/login`
Halaman Register: `/auth/register`
Sesi dapat diakses melalui `authClient` (client-side) atau `auth.api.getSession` (server-side).
