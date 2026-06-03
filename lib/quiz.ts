export type QuizAnswer = "not_yet" | "in_progress" | "acquired"

export interface QuizQuestion {
  id: string
  domainFr: string
  domainEn: string
  questionFr: string
  questionEn: string
  options: { value: QuizAnswer; labelFr: string; labelEn: string }[]
  booksIfNotYet: number[]    // book orderIdx values
  booksIfInProgress: number[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "proprete", domainFr: "Propreté", domainEn: "Toilet training",
    questionFr: "Mon enfant va aux toilettes seul(e) :",
    questionEn: "My child goes to the toilet alone:",
    options: [
      { value: "not_yet", labelFr: "Pas du tout, on commence tout juste", labelEn: "Not at all, just starting" },
      { value: "in_progress", labelFr: "Partiellement, avec beaucoup d'aide", labelEn: "Partially, with lots of help" },
      { value: "acquired", labelFr: "Oui, c'est acquis", labelEn: "Yes, mastered" },
    ],
    booksIfNotYet: [1], booksIfInProgress: [1] },
  { id: "securite", domainFr: "Sécurité en extérieur", domainEn: "Outdoor safety",
    questionFr: "Mon enfant comprend qu'on ne traverse pas seul et reste avec l'adulte :",
    questionEn: "My child understands not to cross alone and stays with the adult:",
    options: [
      { value: "not_yet", labelFr: "Non, c'est un danger quotidien (fugues, impulsivité)", labelEn: "No, it's a daily danger (escaping, impulsivity)" },
      { value: "in_progress", labelFr: "On travaille dessus mais c'est encore difficile", labelEn: "We're working on it but it's still hard" },
      { value: "acquired", labelFr: "Oui, il attend l'adulte", labelEn: "Yes, waits for the adult" },
    ],
    booksIfNotYet: [2], booksIfInProgress: [2] },
  { id: "socialisation", domainFr: "Socialisation", domainEn: "Socialisation",
    questionFr: "Mon enfant joue avec d'autres enfants (partager, interagir, s'approcher) :",
    questionEn: "My child plays with other children (sharing, interacting, approaching):",
    options: [
      { value: "not_yet", labelFr: "Non, il reste isolé ou s'enfuit", labelEn: "No, stays isolated or runs away" },
      { value: "in_progress", labelFr: "Il observe mais n'initie pas le contact", labelEn: "Observes but doesn't initiate contact" },
      { value: "acquired", labelFr: "Il joue, même si c'est encore difficile", labelEn: "Plays, even if still difficult" },
    ],
    booksIfNotYet: [3, 4, 9], booksIfInProgress: [3, 9] },
  { id: "repas", domainFr: "Repas", domainEn: "Mealtime",
    questionFr: "Le repas à table est un moment calme :",
    questionEn: "Mealtime at the table is a calm moment:",
    options: [
      { value: "not_yet", labelFr: "Non, il refuse de s'asseoir ou mange très peu", labelEn: "No, refuses to sit or barely eats" },
      { value: "in_progress", labelFr: "Il mange mais avec tension, crises ou rituels", labelEn: "Eats but with tension, meltdowns or rituals" },
      { value: "acquired", labelFr: "Les repas se passent plutôt bien", labelEn: "Mealtimes go pretty well" },
    ],
    booksIfNotYet: [7, 10], booksIfInProgress: [7] },
  { id: "habillage", domainFr: "Habillage", domainEn: "Getting dressed",
    questionFr: "Mon enfant s'habille seul (même partiellement) :",
    questionEn: "My child dresses alone (even partially):",
    options: [
      { value: "not_yet", labelFr: "Non, il a besoin d'aide totale à chaque fois", labelEn: "No, needs full help every time" },
      { value: "in_progress", labelFr: "Il essaie mais se décourage vite", labelEn: "Tries but gets discouraged quickly" },
      { value: "acquired", labelFr: "Il gère seul la plupart des vêtements", labelEn: "Manages most clothes alone" },
    ],
    booksIfNotYet: [5], booksIfInProgress: [5] },
  { id: "rangement", domainFr: "Rangement et transitions", domainEn: "Tidying and transitions",
    questionFr: "Mon enfant range ses affaires après le jeu :",
    questionEn: "My child tidies up after playing:",
    options: [
      { value: "not_yet", labelFr: "Non, c'est source de crise à chaque fois", labelEn: "No, it causes a meltdown every time" },
      { value: "in_progress", labelFr: "Avec beaucoup d'aide, de rappels et de patience", labelEn: "With lots of help, reminders and patience" },
      { value: "acquired", labelFr: "Oui, il range quand on lui demande", labelEn: "Yes, tidies when asked" },
    ],
    booksIfNotYet: [6], booksIfInProgress: [6] },
  { id: "communication", domainFr: "Communication expressive", domainEn: "Expressive communication",
    questionFr: "Mon enfant dit spontanément ce qu'il veut (sans pointer ni crier) :",
    questionEn: "My child spontaneously says what they want (without pointing or crying):",
    options: [
      { value: "not_yet", labelFr: "Non, il pointe, pleure ou reste bloqué sans mots", labelEn: "No, points, cries or gets stuck without words" },
      { value: "in_progress", labelFr: "Parfois, avec beaucoup d'effort ou en répétant après", labelEn: "Sometimes, with lots of effort or by repeating" },
      { value: "acquired", labelFr: "Oui, il demande verbalement", labelEn: "Yes, asks verbally" },
    ],
    booksIfNotYet: [8], booksIfInProgress: [8] },
  { id: "emotions", domainFr: "Expression émotionnelle", domainEn: "Emotional expression",
    questionFr: "Mon enfant peut dire comment il se sent (« j'ai peur », « je veux pas ») :",
    questionEn: "My child can say how they feel ('I'm scared', 'I don't want to'):",
    options: [
      { value: "not_yet", labelFr: "Non, les émotions débordent sans mots", labelEn: "No, emotions overflow without words" },
      { value: "in_progress", labelFr: "Il répète si on lui montre la phrase modèle", labelEn: "Repeats if shown the model phrase" },
      { value: "acquired", labelFr: "Oui, il exprime ses émotions verbalement", labelEn: "Yes, expresses emotions verbally" },
    ],
    booksIfNotYet: [6, 7, 8], booksIfInProgress: [8] },
  { id: "motricite", domainFr: "Motricité fine", domainEn: "Fine motor skills",
    questionFr: "Mon enfant tient des couverts, coupe, boutonne ses vêtements :",
    questionEn: "My child holds cutlery, cuts, buttons clothes:",
    options: [
      { value: "not_yet", labelFr: "C'est très difficile, il se décourage ou refuse", labelEn: "Very difficult, gets discouraged or refuses" },
      { value: "in_progress", labelFr: "Il essaie mais a besoin de beaucoup d'aide", labelEn: "Tries but needs lots of help" },
      { value: "acquired", labelFr: "Il gère bien la motricité fine", labelEn: "Manages fine motor skills well" },
    ],
    booksIfNotYet: [10], booksIfInProgress: [10] },
]

export interface BookRecommendation {
  orderIdx: number
  priority: "urgent" | "reinforce" | "maintain"
  frequencyFr: string
  frequencyEn: string
}

const FREQUENCY: Record<number, { fr: string; en: string }> = {
  1: { fr: "1x/jour puis 3x/semaine", en: "1x/day then 3x/week" },
  2: { fr: "1x avant chaque sortie", en: "1x before each outing" },
  3: { fr: "1x avant chaque rencontre", en: "1x before each meetup" },
  4: { fr: "1x avant chaque rencontre", en: "1x before each meetup" },
  5: { fr: "1x/jour le matin", en: "1x/day in the morning" },
  6: { fr: "1x avant chaque rangement", en: "1x before each tidy-up" },
  7: { fr: "1x avant chaque repas", en: "1x before each meal" },
  8: { fr: "3x/semaine en jeu calme", en: "3x/week during calm play" },
  9: { fr: "1x avant chaque rencontre", en: "1x before each meetup" },
  10: { fr: "2x/semaine avant repas", en: "2x/week before meals" },
}

export function computeRecommendations(answers: Record<string, QuizAnswer>): BookRecommendation[] {
  const urgentSet = new Set<number>()
  const reinforceSet = new Set<number>()
  const maintainAll = new Set<number>([1,2,3,4,5,6,7,8,9,10])

  for (const q of QUIZ_QUESTIONS) {
    const ans = answers[q.id]
    if (ans === "not_yet") q.booksIfNotYet.forEach(b => urgentSet.add(b))
    else if (ans === "in_progress") q.booksIfInProgress.forEach(b => reinforceSet.add(b))
  }

  const result: BookRecommendation[] = []
  for (const idx of urgentSet) {
    result.push({ orderIdx: idx, priority: "urgent", frequencyFr: FREQUENCY[idx].fr, frequencyEn: FREQUENCY[idx].en })
  }
  for (const idx of reinforceSet) {
    if (!urgentSet.has(idx)) result.push({ orderIdx: idx, priority: "reinforce", frequencyFr: FREQUENCY[idx].fr, frequencyEn: FREQUENCY[idx].en })
  }
  for (const idx of maintainAll) {
    if (!urgentSet.has(idx) && !reinforceSet.has(idx)) result.push({ orderIdx: idx, priority: "maintain", frequencyFr: "1x/semaine", frequencyEn: "1x/week" })
  }
  return result.sort((a, b) => {
    const order = { urgent: 0, reinforce: 1, maintain: 2 }
    return order[a.priority] - order[b.priority] || a.orderIdx - b.orderIdx
  })
}
