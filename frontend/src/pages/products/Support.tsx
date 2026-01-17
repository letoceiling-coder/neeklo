import { ProductPageCompactTemplate } from "@/components/product/ProductPageCompactTemplate";
import productPages from "@/data/productPages.json";

export default function Support() {
  const data = productPages.find((p) => p.slug === "support");

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Страница не найдена</p>
      </div>
    );
  }

  return <ProductPageCompactTemplate data={data} />;
}
