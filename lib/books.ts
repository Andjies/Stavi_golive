import type { Book } from "@prisma/client"

export function serializeBook(b: Book) {
  return {
    id: b.id, slug: b.slug,
    title_fr: b.titleFr, title_en: b.titleEn,
    subtitle_fr: b.subtitleFr, subtitle_en: b.subtitleEn,
    description_fr: b.descriptionFr, description_en: b.descriptionEn,
    cover_url: b.coverData ? `/api/books/${b.id}/cover` : b.coverUrl || "",
    price_ebook: b.priceEbook, price_print: b.pricePrint,
    has_pdf: b.hasPdf, order_idx: b.orderIdx, paper_available: b.paperAvailable,
  }
}
