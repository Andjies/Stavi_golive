# Stavi — Next.js 14 + Prisma

Plateforme de vente de livres PDF pour enfants TSA. Next.js 14 App Router, Prisma (PostgreSQL), Stripe natif, Resend.

## 🚀 Démarrage rapide

```bash
cp .env.example .env
# → remplir les valeurs dans .env

npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Ouvrir http://localhost:3000

## 🔑 Comptes par défaut

- **Admin :** admin@stavi.com / Stavi2026!
  (configurable via ADMIN_EMAIL / ADMIN_PASSWORD dans .env)

## ⚙️ Variables d'environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL : `postgresql://user:pass@host:5432/stavi` |
| `JWT_SECRET` | Chaîne aléatoire ≥ 32 caractères |
| `STRIPE_API_KEY` | Clé Stripe `sk_test_...` ou `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe `whsec_...` |
| `RESEND_API_KEY` | Clé API Resend (emails) |
| `SENDER_EMAIL` | Email expéditeur (ex: hello@stavi.fr) |
| `NEXT_PUBLIC_APP_URL` | URL publique (ex: https://stavi.fr) |

## 🏗️ Architecture

```
stavi-next/
├── app/
│   ├── api/           # 36 routes API REST
│   ├── admin/         # Espace admin (9 onglets)
│   ├── dashboard/     # Bibliothèque utilisateur
│   ├── shop/          # Boutique
│   ├── book/[id]/     # Détail livre
│   ├── quiz/          # Questionnaire d'orientation
│   ├── customize/     # Livre personnalisé
│   ├── community/     # Forum + WhatsApp
│   ├── events/        # Événements
│   ├── donate/        # Dons + aide solidaire
│   ├── aid-request/   # Demande d'aide
│   └── ...
├── components/        # Navbar, Footer, BookCard
├── lib/               # prisma, auth, stripe, email, quiz
└── prisma/            # schema.prisma + seed
```

## 📦 Déploiement Vercel + Supabase (recommandé)

1. Créer une base PostgreSQL sur [Supabase](https://supabase.com)
2. Copier l'URL de connexion dans `DATABASE_URL`
3. Déployer sur [Vercel](https://vercel.com) :
   ```bash
   npx vercel --prod
   ```
4. Ajouter toutes les variables d'environnement dans Vercel
5. Configurer le webhook Stripe → `https://votre-domaine/api/webhook/stripe`

## 📚 Les 10 livres

1. Stavi et les toilettes
2. Stavi marche en sécurité avec Nicky
3. Stavi joue au Playland
4. Stavi au Parc
5. Stavi s'habille tout seul
6. Stavi range ses affaires
7. Stavi mange à table
8. Stavi demande ce qu'il veut
9. Stavi joue avec Anaïs
10. Stavi apprend à couper sa nourriture

## 🎁 Bonus pack collection

L'achat du pack (10 livres) débloque :
- 1 slot de livre personnalisé (formulaire → admin crée le PDF → envoi auto)
- Accès au questionnaire d'orientation (quiz 9 domaines → recommandations)
- Guide complet psychomotricité + logopédie (à upload dans admin > livres)
