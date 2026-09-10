# Hostinger deployment

## 1. Create MySQL database
Create a MySQL database/user in Hostinger hPanel. Note the database name, username, password, and host.

## 2. Import the schema + seed data
Open phpMyAdmin for the Hostinger database and import:

`drizzle/0000_hostinger_mysql.sql`

This creates the tables and loads the existing review/season seed data.

## 3. Environment variables
Set these in the Hostinger Node.js application environment:

- `DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME`
- `DB_CONNECTION_LIMIT=10`
- `ADMIN_EMAIL=your-admin-email@example.com`
- `ADMIN_PASSWORD=your-secure-admin-password`
- `ADMIN_USERNAME=admin` (optional, defaults to "admin")

If the database password contains special URL characters, URL-encode it.

## 4. Build/runtime
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Node.js: use a current supported LTS version available in Hostinger.

The app is a Next.js SSR application and should be deployed as a Node.js web application, not as a static export.

## 5. Admin account authentication
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment. You can directly log in at `/login` using either your admin email or admin username along with your admin password. The application will automatically provision and maintain the admin user in MySQL with the `admin` role. Manual sign-up is not required.

## 6. Authentication change
The project no longer depends on Neon Auth. It now uses a small application-owned session system backed by the same Hostinger MySQL database. Passwords are hashed with Node.js `scrypt`; sessions are stored server-side and identified by an HttpOnly cookie.

## 7. SEO environment variables (optional)
After verifying the domain in Google Search Console, add:

- `GOOGLE_SITE_VERIFICATION=your-google-token`
- `BING_SITE_VERIFICATION=your-bing-token`

Then redeploy so the verification meta tags are rendered.

## 8. SEO URLs
The public indexable sections are:

- `/` — primary IKFW Reviews landing page
- `/reviews` — review directory
- `/reviews/:id` — individual review pages
- `/seasons` — season directory
- `/seasons/:id` — season review pages
- `/cities` — city directory
- `/cities/:city` — city review pages
- `/guides/how-to-read-ikfw-reviews` — parent guide
- `/about` and `/review-policy` — trust/supporting pages

`/sitemap.xml` is generated from the live MySQL data and `/robots.txt` points crawlers to the sitemap while excluding private/API routes.
