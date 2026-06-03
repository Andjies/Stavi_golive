import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const BOOKS = [
  { slug: "stavi-toilettes", titleFr: "Stavi et les toilettes", titleEn: "Stavi and the toilet", subtitleFr: "Une grande étape !", subtitleEn: "A big step!", descriptionFr: "Un livre tendre pour accompagner les enfants TSA dans l'apprentissage de la propreté. Avec des images claires et un texte rassurant, Stavi montre que chaque petit pas est une grande victoire.", descriptionEn: "A gentle book to support children with ASD through potty training. Clear images and reassuring text show that every small step is a big victory.", orderIdx: 1 },
  { slug: "stavi-securite", titleFr: "Stavi marche en sécurité avec Nicky", titleEn: "Stavi walks safely with Nicky", subtitleFr: "Apprendre les règles de sécurité routière", subtitleEn: "Learning road safety rules", descriptionFr: "Nicky montre à Stavi comment traverser en sécurité, attendre l'adulte et contrôler ses impulsions. Un livre essentiel pour réduire les risques de fugues.", descriptionEn: "Nicky shows Stavi how to cross safely, wait for an adult and control impulses. Essential for reducing escape risks.", orderIdx: 2 },
  { slug: "stavi-playland", titleFr: "Stavi joue au Playland", titleEn: "Stavi at the Playland", subtitleFr: "Observer avant d'agir, jouer avec les autres", subtitleEn: "Look before you leap, play with others", descriptionFr: "Stavi part en aventure dans un parc de jeux. Une histoire pour préparer les enfants aux environnements riches en stimulations et aux premières interactions sociales.", descriptionEn: "Stavi goes on an adventure at the playland. A story to prepare children for stimulating environments and first social interactions.", orderIdx: 3 },
  { slug: "stavi-parc", titleFr: "Stavi au Parc", titleEn: "Stavi at the Park", subtitleFr: "Partager, interagir, s'approcher des autres", subtitleEn: "Sharing, interacting, approaching others", descriptionFr: "Au parc, Stavi apprend à partager, gérer ses frustrations et demander verbalement. Des interactions positives avec ses pairs, une étape à la fois.", descriptionEn: "At the park, Stavi learns to share, manage frustration and ask verbally. Positive peer interactions, one step at a time.", orderIdx: 4 },
  { slug: "stavi-habille", titleFr: "Stavi s'habille tout seul", titleEn: "Stavi dresses himself", subtitleFr: "L'autonomie en 7 étapes", subtitleEn: "Autonomy in 7 steps", descriptionFr: "Apprendre à s'habiller seul, du t-shirt aux chaussures. Étape par étape, en image — pour un matin sans crise.", descriptionEn: "Learning to dress alone, from t-shirt to shoes. Step by step, in pictures — for a morning without meltdowns.", orderIdx: 5 },
  { slug: "stavi-range", titleFr: "Stavi range ses affaires", titleEn: "Stavi tidies up", subtitleFr: "Transitions, routines et co-action", subtitleEn: "Transitions, routines and co-action", descriptionFr: "Ranger après le jeu sans crise grâce aux transitions préparées. Stavi montre que flexibilité et rangement peuvent devenir une routine agréable.", descriptionEn: "Tidying up after play without meltdowns through prepared transitions. Stavi shows that flexibility and tidying can become an enjoyable routine.", orderIdx: 6 },
  { slug: "stavi-repas", titleFr: "Stavi mange à table", titleEn: "Stavi eats at the table", subtitleFr: "Rester à table et découvrir de nouveaux aliments", subtitleEn: "Staying at the table and discovering new foods", descriptionFr: "Rester à table, goûter sans pression, rituel avant repas. Un livre pour rendre les repas moins stressants et encourager la diversification alimentaire.", descriptionEn: "Staying at the table, tasting without pressure, mealtime rituals. A book to make mealtimes less stressful and encourage food variety.", orderIdx: 7 },
  { slug: "stavi-demande", titleFr: "Stavi demande ce qu'il veut", titleEn: "Stavi asks for what he wants", subtitleFr: "Communication expressive et autonomie verbale", subtitleEn: "Expressive communication and verbal autonomy", descriptionFr: "Choisir, nommer un désir, dire 'aide-moi'. Moins de frustrations grâce à la communication fonctionnelle, avec les 3 phrases magiques que Stavi utilise chaque jour.", descriptionEn: "Choosing, naming a desire, saying 'help me'. Less frustration through functional communication, with the 3 magic phrases Stavi uses every day.", orderIdx: 8 },
  { slug: "stavi-anais", titleFr: "Stavi joue avec Anaïs", titleEn: "Stavi plays with Anaïs", subtitleFr: "Initier le contact, jouer côte à côte", subtitleEn: "Initiating contact, playing side by side", descriptionFr: "Anaïs et Stavi jouent ensemble. Comment dire oui/non, initier un contact, passer du jeu parallèle au jeu coopératif — pour une première vraie amitié.", descriptionEn: "Anaïs and Stavi play together. How to say yes/no, initiate contact, move from parallel to cooperative play — for a first real friendship.", orderIdx: 9 },
  { slug: "stavi-couper", titleFr: "Stavi apprend à couper sa nourriture", titleEn: "Stavi learns to cut his food", subtitleFr: "Motricité fine, autonomie à table", subtitleEn: "Fine motor skills, table independence", descriptionFr: "Tenir un couteau, couper un aliment mou, persévérer avec aide. Un livre pour renforcer la motricité fine et la confiance à table.", descriptionEn: "Holding a knife, cutting soft food, persevering with help. A book to strengthen fine motor skills and table confidence.", orderIdx: 10 },
]

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@stavi.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "Stavi2026!"

  // Admin
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail.toLowerCase() } })
  if (!existingAdmin) {
    await prisma.user.create({
      data: { email: adminEmail.toLowerCase(), name: "Maman de Stavi", password: await bcrypt.hash(adminPassword, 12), role: "admin", language: "fr" },
    })
    console.log("✅ Admin seeded:", adminEmail)
  }

  // Books
  for (const b of BOOKS) {
    await prisma.book.upsert({
      where: { slug: b.slug },
      update: { titleFr: b.titleFr, titleEn: b.titleEn, subtitleFr: b.subtitleFr, subtitleEn: b.subtitleEn, descriptionFr: b.descriptionFr, descriptionEn: b.descriptionEn, orderIdx: b.orderIdx },
      create: { ...b, priceEbook: 6.99, pricePrint: 14.99, hasPdf: false, paperAvailable: false },
    })
  }
  console.log("✅ 10 books seeded")

  // Settings
  await prisma.settings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global", whatsappLinkFr: "https://chat.whatsapp.com/stavi-fr", whatsappLinkEn: "https://chat.whatsapp.com/stavi-en", bundlePrice: 49.99, personalizedPrice: 24.99 },
  })

  // Sample event
  const evCount = await prisma.event.count()
  if (evCount === 0) {
    await prisma.event.create({ data: { titleFr: "Rencontre des familles Stavi — Genève", titleEn: "Stavi family meetup — Geneva", descriptionFr: "Un après-midi pour que nos enfants se rencontrent, jouent et que les parents échangent.", descriptionEn: "An afternoon for our kids to meet and play while parents share.", date: new Date("2026-09-20T14:00:00Z"), location: "Parc de la Grange, Genève", online: false, link: "" } })
  }

  // Welcome post
  const pCount = await prisma.post.count()
  if (pCount === 0) {
    const admin = await prisma.user.findFirst({ where: { role: "admin" } })
    if (admin) {
      await prisma.post.create({ data: { userId: admin.id, userName: "Maman de Stavi", title: "Bienvenue dans la communauté Stavi ❤️", content: "Je suis tellement heureuse de vous accueillir ici. Cet espace est le nôtre — un endroit doux où l'on s'entraide, on partage nos victoires, nos doutes, nos astuces. Présentez-vous quand vous voulez, sans pression." } })
    }
  }

  console.log("✅ Seed complete")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
